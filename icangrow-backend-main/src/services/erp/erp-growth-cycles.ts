import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type GrowthCycleRow = Database["public"]["Tables"]["growth_cycles"]["Row"];
type GrowthCycleInsert =
	Database["public"]["Tables"]["growth_cycles"]["Insert"];
type GrowthCycleUpdate =
	Database["public"]["Tables"]["growth_cycles"]["Update"];
type StrainRow = Database["public"]["Tables"]["strains"]["Row"];

type StrainInfo = {
	strain_id: string;
	is_primary: boolean;
};

type StrainDetail = Pick<StrainRow, "id" | "name"> & {
	is_primary: boolean;
};

type GrowthCycleWithStrains = GrowthCycleRow & {
	strains_details?: StrainDetail[];
};

export class ERPGrowthCyclesService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * Helper method to process strain details for a growth cycle
	 */
	private async processStrainDetails(
		strains: string[]
	): Promise<StrainDetail[] | undefined> {
		if (!Array.isArray(strains) || strains.length === 0) {
			return undefined;
		}

		// Check if strains is in new format (JSON strings) or old format (strain IDs)
		const isNewFormat = strains[0].startsWith("{");

		if (isNewFormat) {
			// New format: array of JSON strings containing strain objects
			const strainInfos: StrainInfo[] = strains.map((strainStr: string) => {
				try {
					return JSON.parse(strainStr) as StrainInfo;
				} catch {
					// Fallback to old format if parsing fails
					return { strain_id: strainStr, is_primary: false };
				}
			});

			const strainIds = strainInfos.map((s: StrainInfo) => s.strain_id);

			const { data: strainsData, error: strainsError } = await this.supabase
				.from("strains")
				.select("id,name")
				.in("id", strainIds);
			if (strainsError) throw strainsError;

			// Map strain details with is_primary flag
			return strainInfos.map((strainInfo: StrainInfo) => {
				const strain = strainsData?.find(
					(s: any) => s.id === strainInfo.strain_id
				);
				return {
					id: strain?.id || strainInfo.strain_id,
					name: strain?.name || "Unknown Strain",
					is_primary: strainInfo.is_primary,
				};
			});
		} else {
			// Old format: array of strings (strain IDs)
			const strainIds = strains as string[];

			const { data: strainsData, error: strainsError } = await this.supabase
				.from("strains")
				.select("id,name")
				.in("id", strainIds);
			if (strainsError) throw strainsError;

			// Map strain details (all non-primary for old format)
			return (
				strainsData?.map((strain: any) => ({
					id: strain.id,
					name: strain.name,
					is_primary: false,
				})) || []
			);
		}
	}

	public async list(params: {
		q?: string;
		status?: GrowthCycleRow["status"];
		start_date_from?: string;
		start_date_to?: string;
		page: number;
		limit: number;
	}): Promise<{
		items: GrowthCycleWithStrains[];
		total: number;
		page: number;
		limit: number;
	}> {
		const { q, status, start_date_from, start_date_to, page, limit } = params;
		const from = (page - 1) * limit;
		const to = from + limit - 1;

		let query = this.supabase
			.from("growth_cycles")
			.select("*", { count: "exact" })
			.range(from, to)
			.order("created_at", { ascending: false });

		if (status) query = query.eq("status", status);
		if (q && q.trim()) query = query.ilike("name", `%${q}%`);
		if (start_date_from) query = query.gte("start_date", start_date_from);
		if (start_date_to) query = query.lte("start_date", start_date_to);

		const { data, error, count } = await query;
		if (error) throw error;

		// Process each growth cycle to include strain details
		const itemsWithStrainDetails: GrowthCycleWithStrains[] = [];

		for (const cycle of data ?? []) {
			const strains_details = await this.processStrainDetails(cycle.strains);

			itemsWithStrainDetails.push({
				...(cycle as GrowthCycleRow),
				strains_details,
			});
		}

		return { items: itemsWithStrainDetails, total: count ?? 0, page, limit };
	}

	public async getById(id: string): Promise<GrowthCycleWithStrains | null> {
		const { data, error } = await this.supabase
			.from("growth_cycles")
			.select("*")
			.eq("id", id)
			.single();
		if (error) throw error;
		if (!data) return null;

		const strains_details = await this.processStrainDetails(data.strains);

		return { ...(data as GrowthCycleRow), strains_details };
	}

	public async create(payload: {
		name: string;
		start_date: string;
		end_date?: string | null;
		strains: StrainInfo[];
		facility_location: string;
		status?: GrowthCycleRow["status"];
		notes?: string | null;
		created_by: string;
	}): Promise<GrowthCycleRow> {
		// Validate that at least one strain is marked as primary
		const hasPrimary = payload.strains.some((strain) => strain.is_primary);
		if (!hasPrimary) {
			throw new Error("At least one strain must be marked as primary");
		}

		// Validate that strain IDs exist
		const strainIds = payload.strains.map((s) => s.strain_id);
		const { data: existingStrains, error: validationError } =
			await this.supabase.from("strains").select("id").in("id", strainIds);

		if (validationError) throw validationError;
		if (!existingStrains || existingStrains.length !== strainIds.length) {
			throw new Error("One or more strain IDs are invalid");
		}

		// Convert strain objects to JSON strings for database storage
		const strainsAsStrings = payload.strains.map((strain) =>
			JSON.stringify(strain)
		);

		const insert: GrowthCycleInsert = {
			name: payload.name,
			start_date: payload.start_date,
			end_date: payload.end_date ?? null,
			strains: strainsAsStrings, // Store as JSON strings
			facility_location: payload.facility_location,
			status: payload.status ?? ("planning" as GrowthCycleRow["status"]),
			notes: payload.notes ?? null,
			created_by: payload.created_by,
		};
		const { data, error } = await this.supabase
			.from("growth_cycles")
			.insert(insert)
			.select("*")
			.single();
		if (error) throw error;
		return data as GrowthCycleRow;
	}

	public async update(
		id: string,
		payload: GrowthCycleUpdate & { strains?: StrainInfo[] }
	): Promise<GrowthCycleRow> {
		const updatePayload: GrowthCycleUpdate = { ...payload };

		// Handle strains update with validation
		if (payload.strains !== undefined) {
			const strains = payload.strains;
			// Validate that at least one strain is marked as primary
			const hasPrimary = strains.some(
				(strain: StrainInfo) => strain.is_primary
			);
			if (!hasPrimary) {
				throw new Error("At least one strain must be marked as primary");
			}

			// Validate that strain IDs exist
			const strainIds = strains.map((s: StrainInfo) => s.strain_id);
			const { data: existingStrains, error: validationError } =
				await this.supabase.from("strains").select("id").in("id", strainIds);

			if (validationError) throw validationError;
			if (!existingStrains || existingStrains.length !== strainIds.length) {
				throw new Error("One or more strain IDs are invalid");
			}

			// Convert strain objects to JSON strings for database storage
			updatePayload.strains = strains.map((strain: StrainInfo) =>
				JSON.stringify(strain)
			);
		}

		const { data, error } = await this.supabase
			.from("growth_cycles")
			.update(updatePayload)
			.eq("id", id)
			.select("*")
			.single();
		if (error) throw error;
		return data as GrowthCycleRow;
	}

	public async remove(id: string): Promise<void> {
		const { error } = await this.supabase
			.from("growth_cycles")
			.delete()
			.eq("id", id);
		if (error) throw error;
	}
}
