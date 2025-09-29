import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type Deviation = Database["public"]["Tables"]["deviations"]["Row"];
type DeviationInsert = Database["public"]["Tables"]["deviations"]["Insert"];
type DeviationUpdate = Database["public"]["Tables"]["deviations"]["Update"];

export interface DeviationFilters {
	batch_id?: string;
	assignee?: string;
	severity?: string;
	status?: string;
	q?: string;
	page?: number;
	limit?: number;
}

export interface DeviationListResponse {
	deviations: Deviation[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateDeviationData {
	title: string;
	description: string;
	batch_id?: string;
	occurred_at: string;
	assignee?: string;
	corrective_action?: string;
	preventive_action?: string;
	severity?: string;
	status?: string;
}

export interface UpdateDeviationData {
	title?: string;
	description?: string;
	occurred_at?: string;
	assignee?: string;
	corrective_action?: string;
	preventive_action?: string;
	severity?: string;
	status?: string;
	resolved_at?: string;
}

export class QMSDeviationsService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List deviations with optional filters
	 */
	async listDeviations(
		filters: DeviationFilters = {}
	): Promise<DeviationListResponse> {
		try {
			const {
				batch_id,
				assignee,
				severity,
				status,
				q,
				page = 1,
				limit = 20,
			} = filters;

			let query = this.supabase.from("deviations").select(
				`
					*,
					assignee_profile:profiles!deviations_assignee_fkey(full_name, role),
					reported_by_profile:profiles!deviations_reported_by_fkey(full_name, role)
				`,
				{ count: "exact" }
			);

			// Apply filters
			if (batch_id) {
				query = query.eq("batch_id", batch_id);
			}
			if (assignee) {
				query = query.eq("assignee", assignee);
			}
			if (severity) {
				query = query.eq("severity", severity);
			}
			if (status) {
				query = query.eq("status", status);
			}
			if (q) {
				query = query.or(
					`title.ilike.%${q}%,description.ilike.%${q}%,corrective_action.ilike.%${q}%,preventive_action.ilike.%${q}%`
				);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by created_at (newest first)
			query = query.order("created_at", { ascending: false });

			const { data: deviations, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch deviations: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				deviations: deviations || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list deviations: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single deviation by ID
	 */
	async getDeviationById(deviationId: string): Promise<Deviation> {
		try {
			const { data: deviation, error } = await this.supabase
				.from("deviations")
				.select(
					`
					*,
					assignee_profile:profiles!deviations_assignee_fkey(full_name, role),
					reported_by_profile:profiles!deviations_reported_by_fkey(full_name, role)
				`
				)
				.eq("id", deviationId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Deviation not found");
				}
				throw new Error(`Failed to fetch deviation: ${error.message}`);
			}

			return deviation;
		} catch (error) {
			throw new Error(
				`Failed to get deviation: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Create a new deviation
	 */
	async createDeviation(
		data: CreateDeviationData,
		reportedBy: string
	): Promise<Deviation> {
		try {
			const deviationData: DeviationInsert = {
				title: data.title,
				description: data.description,
				batch_id: data.batch_id || null,
				occurred_at: data.occurred_at,
				assignee: data.assignee || null,
				corrective_action: data.corrective_action || null,
				preventive_action: data.preventive_action || null,
				severity: data.severity || "medium",
				status: data.status || "open",
				reported_by: reportedBy,
				auto_generated: false,
			};

			const { data: deviation, error } = await this.supabase
				.from("deviations")
				.insert(deviationData)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create deviation: ${error.message}`);
			}

			return deviation;
		} catch (error) {
			throw new Error(
				`Failed to create deviation: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Update an existing deviation
	 */
	async updateDeviation(
		deviationId: string,
		data: UpdateDeviationData
	): Promise<Deviation> {
		try {
			const updateData: DeviationUpdate = {};

			// Only include fields that are provided
			if (data.title !== undefined) updateData.title = data.title;
			if (data.description !== undefined)
				updateData.description = data.description;
			if (data.occurred_at !== undefined)
				updateData.occurred_at = data.occurred_at;
			if (data.assignee !== undefined) updateData.assignee = data.assignee;
			if (data.corrective_action !== undefined)
				updateData.corrective_action = data.corrective_action;
			if (data.preventive_action !== undefined)
				updateData.preventive_action = data.preventive_action;
			if (data.severity !== undefined) updateData.severity = data.severity;
			if (data.status !== undefined) updateData.status = data.status;
			if (data.resolved_at !== undefined)
				updateData.resolved_at = data.resolved_at;

			const { data: deviation, error } = await this.supabase
				.from("deviations")
				.update(updateData)
				.eq("id", deviationId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Deviation not found");
				}
				throw new Error(`Failed to update deviation: ${error.message}`);
			}

			return deviation;
		} catch (error) {
			throw new Error(
				`Failed to update deviation: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Resolve a deviation
	 */
	async resolveDeviation(
		deviationId: string,
		resolutionData: {
			corrective_action?: string;
			preventive_action?: string;
			resolved_at?: string;
		}
	): Promise<Deviation> {
		try {
			const updateData: DeviationUpdate = {
				status: "resolved",
				resolved_at: resolutionData.resolved_at || new Date().toISOString(),
			};

			if (resolutionData.corrective_action) {
				updateData.corrective_action = resolutionData.corrective_action;
			}
			if (resolutionData.preventive_action) {
				updateData.preventive_action = resolutionData.preventive_action;
			}

			const { data: deviation, error } = await this.supabase
				.from("deviations")
				.update(updateData)
				.eq("id", deviationId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Deviation not found");
				}
				throw new Error(`Failed to resolve deviation: ${error.message}`);
			}

			return deviation;
		} catch (error) {
			throw new Error(
				`Failed to resolve deviation: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if deviation exists
	 */
	async deviationExists(deviationId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("deviations")
				.select("id")
				.eq("id", deviationId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get deviations for a specific batch
	 */
	async getDeviationsByBatch(batchId: string): Promise<Deviation[]> {
		try {
			const { data: deviations, error } = await this.supabase
				.from("deviations")
				.select(
					`
					*,
					assignee_profile:profiles!deviations_assignee_fkey(full_name, role),
					reported_by_profile:profiles!deviations_reported_by_fkey(full_name, role)
				`
				)
				.eq("batch_id", batchId)
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(`Failed to fetch batch deviations: ${error.message}`);
			}

			return deviations || [];
		} catch (error) {
			throw new Error(
				`Failed to get batch deviations: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}
}
