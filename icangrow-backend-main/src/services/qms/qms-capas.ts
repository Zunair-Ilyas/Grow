import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type Capa = Database["public"]["Tables"]["capas"]["Row"];
type CapaInsert = Database["public"]["Tables"]["capas"]["Insert"];
type CapaUpdate = Database["public"]["Tables"]["capas"]["Update"];

export interface CapaFilters {
	deviation_id?: string;
	assignee?: string;
	action_type?: string;
	priority?: string;
	status?: string;
	q?: string;
	page?: number;
	limit?: number;
}

export interface CapaListResponse {
	capas: Capa[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateCapaData {
	title: string;
	description: string;
	deviation_id?: string;
	action_type?: string;
	assignee?: string;
	due_date?: string;
	priority?: string;
	status?: string;
}

export interface UpdateCapaData {
	title?: string;
	description?: string;
	action_type?: string;
	assignee?: string;
	due_date?: string;
	completion_date?: string;
	priority?: string;
	status?: string;
	effectiveness_review?: string;
}

export class QMSCapasService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List CAPAs with optional filters
	 */
	async listCapas(filters: CapaFilters = {}): Promise<CapaListResponse> {
		try {
			const {
				deviation_id,
				assignee,
				action_type,
				priority,
				status,
				q,
				page = 1,
				limit = 20,
			} = filters;

			let query = this.supabase.from("capas").select(
				`
					*,
					assignee_profile:profiles!capas_assignee_fkey(full_name, role),
					created_by_profile:profiles!capas_created_by_fkey(full_name, role),
					deviation:deviations(title, description, severity)
				`,
				{ count: "exact" }
			);

			// Apply filters
			if (deviation_id) {
				query = query.eq("deviation_id", deviation_id);
			}
			if (assignee) {
				query = query.eq("assignee", assignee);
			}
			if (action_type) {
				query = query.eq("action_type", action_type);
			}
			if (priority) {
				query = query.eq("priority", priority);
			}
			if (status) {
				query = query.eq("status", status);
			}
			if (q) {
				query = query.or(
					`title.ilike.%${q}%,description.ilike.%${q}%,effectiveness_review.ilike.%${q}%`
				);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by created_at (newest first)
			query = query.order("created_at", { ascending: false });

			const { data: capas, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch CAPAs: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				capas: capas || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list CAPAs: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single CAPA by ID
	 */
	async getCapaById(capaId: string): Promise<Capa> {
		try {
			const { data: capa, error } = await this.supabase
				.from("capas")
				.select(
					`
					*,
					assignee_profile:profiles!capas_assignee_fkey(full_name, role),
					created_by_profile:profiles!capas_created_by_fkey(full_name, role),
					deviation:deviations(title, description, severity)
				`
				)
				.eq("id", capaId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("CAPA not found");
				}
				throw new Error(`Failed to fetch CAPA: ${error.message}`);
			}

			return capa;
		} catch (error) {
			throw new Error(
				`Failed to get CAPA: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Create a new CAPA
	 */
	async createCapa(data: CreateCapaData, createdBy: string): Promise<Capa> {
		try {
			const capaData: CapaInsert = {
				title: data.title,
				description: data.description,
				deviation_id: data.deviation_id || null,
				action_type: data.action_type || "corrective",
				assignee: data.assignee || null,
				due_date: data.due_date || null,
				priority: data.priority || "medium",
				status: data.status || "open",
				created_by: createdBy,
			};

			const { data: capa, error } = await this.supabase
				.from("capas")
				.insert(capaData)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create CAPA: ${error.message}`);
			}

			return capa;
		} catch (error) {
			throw new Error(
				`Failed to create CAPA: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Update an existing CAPA
	 */
	async updateCapa(capaId: string, data: UpdateCapaData): Promise<Capa> {
		try {
			const updateData: CapaUpdate = {};

			// Only include fields that are provided
			if (data.title !== undefined) updateData.title = data.title;
			if (data.description !== undefined)
				updateData.description = data.description;
			if (data.action_type !== undefined)
				updateData.action_type = data.action_type;
			if (data.assignee !== undefined) updateData.assignee = data.assignee;
			if (data.due_date !== undefined) updateData.due_date = data.due_date;
			if (data.completion_date !== undefined)
				updateData.completion_date = data.completion_date;
			if (data.priority !== undefined) updateData.priority = data.priority;
			if (data.status !== undefined) updateData.status = data.status;
			if (data.effectiveness_review !== undefined)
				updateData.effectiveness_review = data.effectiveness_review;

			const { data: capa, error } = await this.supabase
				.from("capas")
				.update(updateData)
				.eq("id", capaId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("CAPA not found");
				}
				throw new Error(`Failed to update CAPA: ${error.message}`);
			}

			return capa;
		} catch (error) {
			throw new Error(
				`Failed to update CAPA: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Complete a CAPA
	 */
	async completeCapa(
		capaId: string,
		completionData: {
			completion_date?: string;
			effectiveness_review?: string;
		}
	): Promise<Capa> {
		try {
			const updateData: CapaUpdate = {
				status: "completed",
				completion_date:
					completionData.completion_date || new Date().toISOString(),
			};

			if (completionData.effectiveness_review) {
				updateData.effectiveness_review = completionData.effectiveness_review;
			}

			const { data: capa, error } = await this.supabase
				.from("capas")
				.update(updateData)
				.eq("id", capaId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("CAPA not found");
				}
				throw new Error(`Failed to complete CAPA: ${error.message}`);
			}

			return capa;
		} catch (error) {
			throw new Error(
				`Failed to complete CAPA: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if CAPA exists
	 */
	async capaExists(capaId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("capas")
				.select("id")
				.eq("id", capaId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get CAPAs for a specific deviation
	 */
	async getCapasByDeviation(deviationId: string): Promise<Capa[]> {
		try {
			const { data: capas, error } = await this.supabase
				.from("capas")
				.select(
					`
					*,
					assignee_profile:profiles!capas_assignee_fkey(full_name, role),
					created_by_profile:profiles!capas_created_by_fkey(full_name, role)
				`
				)
				.eq("deviation_id", deviationId)
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(`Failed to fetch deviation CAPAs: ${error.message}`);
			}

			return capas || [];
		} catch (error) {
			throw new Error(
				`Failed to get deviation CAPAs: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}
}

