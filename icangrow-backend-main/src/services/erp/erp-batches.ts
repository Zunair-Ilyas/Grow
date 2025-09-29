import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type Batch = Database["public"]["Tables"]["batches"]["Row"];
type BatchInsert = Database["public"]["Tables"]["batches"]["Insert"];
type BatchUpdate = Database["public"]["Tables"]["batches"]["Update"];

export interface BatchFilters {
	stage?: string;
	location_id?: string;
	strain_name?: string;
	status?: string;
	cycle_id?: string;
	room?: string;
	page?: number;
	limit?: number;
}

export interface BatchListResponse {
	batches: Batch[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateBatchData {
	name: string;
	strain: string;
	strain_id?: string;
	cycle_id: string;
	room: string;
	plant_count?: number;
	start_date?: string;
	clone_date?: string;
	expected_harvest_date?: string;
	notes?: string;
	current_stage?: string;
	status?: string;
	progress?: number;
}

export interface UpdateBatchData {
	name?: string;
	strain?: string;
	strain_id?: string;
	cycle_id?: string;
	room?: string;
	plant_count?: number;
	start_date?: string;
	clone_date?: string;
	expected_harvest_date?: string;
	notes?: string;
	current_stage?: string;
	status?: string;
	progress?: number;
}

export class ERPBatchesService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	private async ensureStrainInCycle(options: {
		cycleId: string;
		strainId?: string | null;
		strainName?: string | null;
	}): Promise<{ strainId: string; strainName: string }> {
		const { cycleId, strainId, strainName } = options;

		// Fetch cycle to get allowed strain IDs
		const { data: cycle, error: cycleError } = await this.supabase
			.from("growth_cycles")
			.select("id,strains")
			.eq("id", cycleId)
			.single();
		if (cycleError || !cycle) {
			throw new Error("Invalid cycle_id: growth cycle not found");
		}

		const allowedStrainIds: string[] = Array.isArray(cycle.strains)
			? (cycle.strains as string[])
			: [];

		let resolvedStrainId = strainId ?? null;
		let resolvedStrainName = strainName ?? null;

		// If only name provided, resolve to ID
		if (!resolvedStrainId && resolvedStrainName) {
			const { data: s, error: sErr } = await this.supabase
				.from("strains")
				.select("id,name")
				.ilike("name", resolvedStrainName)
				.limit(1)
				.single();
			if (sErr || !s) {
				throw new Error("Invalid strain: not found");
			}
			resolvedStrainId = s.id;
			resolvedStrainName = s.name;
		}

		if (!resolvedStrainId) {
			throw new Error(
				"strain_id is required or provide a valid strain name to resolve"
			);
		}

		// Ensure the strain ID is part of the cycle
		if (!allowedStrainIds.includes(resolvedStrainId)) {
			throw new Error(
				"The selected strain is not part of the specified growth cycle"
			);
		}

		// Ensure we have the strain name
		if (!resolvedStrainName) {
			const { data: s2, error: s2Err } = await this.supabase
				.from("strains")
				.select("id,name")
				.eq("id", resolvedStrainId)
				.single();
			if (s2Err || !s2) {
				throw new Error("Failed to load strain details");
			}
			resolvedStrainName = s2.name;
		}

		return { strainId: resolvedStrainId, strainName: resolvedStrainName! };
	}

	/**
	 * List batches with optional filters
	 */
	async listBatches(filters: BatchFilters = {}): Promise<BatchListResponse> {
		try {
			const {
				stage,
				location_id,
				strain_name,
				status,
				cycle_id,
				room,
				page = 1,
				limit = 20,
			} = filters;

			let query = this.supabase.from("batches").select("*", { count: "exact" });

			// Apply filters
			if (stage) {
				query = query.eq("current_stage", stage);
			}
			if (status) {
				query = query.eq("status", status);
			}
			if (cycle_id) {
				query = query.eq("cycle_id", cycle_id);
			}
			if (room) {
				query = query.eq("room", room);
			}
			if (strain_name) {
				query = query.ilike("strain", `%${strain_name}%`);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by creation date (newest first)
			query = query.order("created_at", { ascending: false });

			const { data: batches, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch batches: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				batches: batches || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list batches: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single batch by ID
	 */
	async getBatchById(batchId: string): Promise<Batch> {
		try {
			const { data: batch, error } = await this.supabase
				.from("batches")
				.select("*")
				.eq("id", batchId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Batch not found");
				}
				throw new Error(`Failed to fetch batch: ${error.message}`);
			}

			return batch;
		} catch (error) {
			throw new Error(
				`Failed to get batch: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Create a new batch
	 */
	async createBatch(data: CreateBatchData, createdBy: string): Promise<Batch> {
		try {
			// Validate strain belongs to cycle; resolve id/name
			const { strainId, strainName } = await this.ensureStrainInCycle({
				cycleId: data.cycle_id,
				strainId: data.strain_id ?? null,
				strainName: data.strain ?? null,
			});

			const batchData: BatchInsert = {
				name: data.name,
				strain: strainName,
				strain_id: strainId,
				cycle_id: data.cycle_id,
				room: data.room,
				plant_count: data.plant_count || 0,
				start_date: data.start_date || null,
				clone_date: data.clone_date || null,
				expected_harvest_date: data.expected_harvest_date || null,
				notes: data.notes || null,
				current_stage: (data.current_stage as any) || "cloning",
				status: (data.status as any) || "active",
				progress: data.progress || 0,
				created_by: createdBy,
			};

			const { data: batch, error } = await this.supabase
				.from("batches")
				.insert(batchData)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create batch: ${error.message}`);
			}

			return batch;
		} catch (error) {
			throw new Error(
				`Failed to create batch: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Update an existing batch
	 */
	async updateBatch(batchId: string, data: UpdateBatchData): Promise<Batch> {
		try {
			const updateData: BatchUpdate = {};

			// Only include fields that are provided
			if (data.name !== undefined) updateData.name = data.name;
			// If strain or strain_id is being changed, validate against cycle
			if (data.strain !== undefined || data.strain_id !== undefined) {
				// Determine cycle id to validate with: prefer input, fallback to existing
				let cycleIdToUse = data.cycle_id;
				if (!cycleIdToUse) {
					const { data: existing, error: exErr } = await this.supabase
						.from("batches")
						.select("cycle_id")
						.eq("id", batchId)
						.single();
					if (exErr || !existing) {
						throw new Error("Batch not found for strain validation");
					}
					cycleIdToUse = existing.cycle_id as string;
				}
				const { strainId, strainName } = await this.ensureStrainInCycle({
					cycleId: cycleIdToUse,
					strainId: data.strain_id ?? null,
					strainName: data.strain ?? null,
				});
				updateData.strain = strainName;
				updateData.strain_id = strainId;
			}
			if (data.cycle_id !== undefined) updateData.cycle_id = data.cycle_id;
			if (data.room !== undefined) updateData.room = data.room;
			if (data.plant_count !== undefined)
				updateData.plant_count = data.plant_count;
			if (data.start_date !== undefined)
				updateData.start_date = data.start_date;
			if (data.clone_date !== undefined)
				updateData.clone_date = data.clone_date;
			if (data.expected_harvest_date !== undefined)
				updateData.expected_harvest_date = data.expected_harvest_date;
			if (data.notes !== undefined) updateData.notes = data.notes;
			if (data.current_stage !== undefined)
				updateData.current_stage = data.current_stage as any;
			if (data.status !== undefined) updateData.status = data.status as any;
			if (data.progress !== undefined) updateData.progress = data.progress;

			const { data: batch, error } = await this.supabase
				.from("batches")
				.update(updateData)
				.eq("id", batchId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Batch not found");
				}
				throw new Error(`Failed to update batch: ${error.message}`);
			}

			return batch;
		} catch (error) {
			throw new Error(
				`Failed to update batch: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Delete a batch
	 */
	async deleteBatch(batchId: string): Promise<void> {
		try {
			const { error } = await this.supabase
				.from("batches")
				.delete()
				.eq("id", batchId);

			if (error) {
				throw new Error(`Failed to delete batch: ${error.message}`);
			}
		} catch (error) {
			throw new Error(
				`Failed to delete batch: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if batch exists
	 */
	async batchExists(batchId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("batches")
				.select("id")
				.eq("id", batchId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}
}
