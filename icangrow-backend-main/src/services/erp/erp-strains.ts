import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type StrainRow = Database["public"]["Tables"]["strains"]["Row"];
type StrainInsert = Database["public"]["Tables"]["strains"]["Insert"];
type StrainUpdate = Database["public"]["Tables"]["strains"]["Update"];

export class ERPStrainsService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	public async listStrains(params: {
		q?: string;
		is_active?: boolean;
		page: number;
		limit: number;
	}): Promise<{
		items: StrainRow[];
		total: number;
		page: number;
		limit: number;
	}> {
		const { q, is_active, page, limit } = params;
		const from = (page - 1) * limit;
		const to = from + limit - 1;

		let query = this.supabase
			.from("strains")
			.select("*", { count: "exact" })
			.range(from, to)
			.order("created_at", { ascending: false });

		if (typeof is_active === "boolean") {
			query = query.eq("is_active", is_active);
		}
		if (q && q.trim()) {
			// name ilike search
			query = query.ilike("name", `%${q}%`);
		}

		const { data, error, count } = await query;
		if (error) throw error;
		return { items: data ?? [], total: count ?? 0, page, limit };
	}

	public async getStrainById(id: string): Promise<StrainRow | null> {
		const { data, error } = await this.supabase
			.from("strains")
			.select("*")
			.eq("id", id)
			.single();
		if (error) throw error;
		return data ?? null;
	}

	public async createStrain(payload: {
		name: string;
		description?: string;
		genetics?: string;
		flowering_time_days?: number;
		created_by: string;
		is_active?: boolean;
	}): Promise<StrainRow> {
		const insert: StrainInsert = {
			name: payload.name,
			description: payload.description,
			genetics: payload.genetics,
			flowering_time_days: payload.flowering_time_days,
			created_by: payload.created_by,
			is_active: payload.is_active ?? true,
		};
		const { data, error } = await this.supabase
			.from("strains")
			.insert(insert)
			.select("*")
			.single();
		if (error) throw error;
		return data as StrainRow;
	}

	public async updateStrain(
		id: string,
		payload: StrainUpdate
	): Promise<StrainRow> {
		const { data, error } = await this.supabase
			.from("strains")
			.update(payload)
			.eq("id", id)
			.select("*")
			.single();
		if (error) throw error;
		return data as StrainRow;
	}

	public async deleteStrain(id: string): Promise<void> {
		const { error } = await this.supabase.from("strains").delete().eq("id", id);
		if (error) throw error;
	}
}
