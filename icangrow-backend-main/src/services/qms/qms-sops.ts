import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type Sop = Database["public"]["Tables"]["sops"]["Row"];
type SopInsert = Database["public"]["Tables"]["sops"]["Insert"];
type SopUpdate = Database["public"]["Tables"]["sops"]["Update"];

export interface SopFilters {
	category?: string;
	status?: string;
	q?: string;
	page?: number;
	limit?: number;
}

export interface SopListResponse {
	sops: SopWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface SopWithDetails extends Sop {
	created_by_profile?: {
		full_name: string;
		role: string;
	};
	approved_by_profile?: {
		full_name: string;
		role: string;
	};
}

export interface CreateSopData {
	title: string;
	sop_number: string;
	category: string;
	description?: string;
	version?: string;
	content?: string;
	effective_date?: string;
	review_date?: string;
	status?: string;
}

export interface UpdateSopData {
	title?: string;
	sop_number?: string;
	category?: string;
	description?: string;
	version?: string;
	content?: string;
	effective_date?: string;
	review_date?: string;
	status?: string;
}

export class QMSSopsService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List SOPs with optional filters
	 */
	async listSops(filters: SopFilters = {}): Promise<SopListResponse> {
		try {
			const { category, status, q, page = 1, limit = 20 } = filters;

			let query = this.supabase.from("sops").select(
				`
					*,
					created_by_profile:profiles!sops_created_by_fkey(full_name, role),
					approved_by_profile:profiles!sops_approved_by_fkey(full_name, role)
				`,
				{ count: "exact" }
			);

			// Apply filters
			if (category) {
				query = query.eq("category", category);
			}
			if (status) {
				query = query.eq("status", status);
			}
			if (q) {
				query = query.or(
					`title.ilike.%${q}%,sop_number.ilike.%${q}%,description.ilike.%${q}%,content.ilike.%${q}%`
				);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by created_at (newest first)
			query = query.order("created_at", { ascending: false });

			const { data: sops, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch SOPs: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				sops: sops || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list SOPs: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single SOP by ID
	 */
	async getSopById(sopId: string): Promise<SopWithDetails> {
		try {
			const { data: sop, error } = await this.supabase
				.from("sops")
				.select(
					`
					*,
					created_by_profile:profiles!sops_created_by_fkey(full_name, role),
					approved_by_profile:profiles!sops_approved_by_fkey(full_name, role)
				`
				)
				.eq("id", sopId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("SOP not found");
				}
				throw new Error(`Failed to fetch SOP: ${error.message}`);
			}

			return sop;
		} catch (error) {
			throw new Error(
				`Failed to get SOP: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Create a new SOP
	 */
	async createSop(data: CreateSopData, createdBy: string): Promise<Sop> {
		try {
			const sopData: SopInsert = {
				title: data.title,
				sop_number: data.sop_number,
				category: data.category,
				description: data.description || null,
				version: data.version || "1.0",
				content: data.content || null,
				effective_date: data.effective_date || null,
				review_date: data.review_date || null,
				status: data.status || "draft",
				created_by: createdBy,
			};

			const { data: sop, error } = await this.supabase
				.from("sops")
				.insert(sopData)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create SOP: ${error.message}`);
			}

			return sop;
		} catch (error) {
			throw new Error(
				`Failed to create SOP: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Update an existing SOP
	 */
	async updateSop(sopId: string, data: UpdateSopData): Promise<Sop> {
		try {
			const updateData: SopUpdate = {};

			// Only include fields that are provided
			if (data.title !== undefined) updateData.title = data.title;
			if (data.sop_number !== undefined)
				updateData.sop_number = data.sop_number;
			if (data.category !== undefined) updateData.category = data.category;
			if (data.description !== undefined)
				updateData.description = data.description;
			if (data.version !== undefined) updateData.version = data.version;
			if (data.content !== undefined) updateData.content = data.content;
			if (data.effective_date !== undefined)
				updateData.effective_date = data.effective_date;
			if (data.review_date !== undefined)
				updateData.review_date = data.review_date;
			if (data.status !== undefined) updateData.status = data.status;

			const { data: sop, error } = await this.supabase
				.from("sops")
				.update(updateData)
				.eq("id", sopId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("SOP not found");
				}
				throw new Error(`Failed to update SOP: ${error.message}`);
			}

			return sop;
		} catch (error) {
			throw new Error(
				`Failed to update SOP: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Approve an SOP
	 */
	async approveSop(sopId: string, approvedBy: string): Promise<Sop> {
		try {
			const updateData: SopUpdate = {
				status: "approved",
				approved_by: approvedBy,
				approved_at: new Date().toISOString(),
			};

			const { data: sop, error } = await this.supabase
				.from("sops")
				.update(updateData)
				.eq("id", sopId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("SOP not found");
				}
				throw new Error(`Failed to approve SOP: ${error.message}`);
			}

			return sop;
		} catch (error) {
			throw new Error(
				`Failed to approve SOP: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if SOP exists
	 */
	async sopExists(sopId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("sops")
				.select("id")
				.eq("id", sopId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get SOPs by category
	 */
	async getSopsByCategory(category: string): Promise<Sop[]> {
		try {
			const { data: sops, error } = await this.supabase
				.from("sops")
				.select("*")
				.eq("category", category)
				.eq("status", "approved")
				.order("title", { ascending: true });

			if (error) {
				throw new Error(`Failed to fetch SOPs by category: ${error.message}`);
			}

			return sops || [];
		} catch (error) {
			throw new Error(
				`Failed to get SOPs by category: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get all SOP categories
	 */
	async getSopCategories(): Promise<string[]> {
		try {
			const { data: categories, error } = await this.supabase
				.from("sops")
				.select("category")
				.not("category", "is", null);

			if (error) {
				throw new Error(`Failed to fetch SOP categories: ${error.message}`);
			}

			// Extract unique categories
			const categoryStrings =
				categories?.map((item: { category: string }) => item.category) || [];
			const uniqueCategories: string[] = Array.from(new Set(categoryStrings));

			return uniqueCategories.sort();
		} catch (error) {
			throw new Error(
				`Failed to get SOP categories: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}
}
