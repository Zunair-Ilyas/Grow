import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type Packaging = Database["public"]["Tables"]["qa_batch_approvals"]["Row"];
type PackagingInsert =
	Database["public"]["Tables"]["qa_batch_approvals"]["Insert"];
type PackagingUpdate =
	Database["public"]["Tables"]["qa_batch_approvals"]["Update"];

export interface PackagingFilters {
	batch_id?: string;
	status?: string;
	page?: number;
	limit?: number;
}

export interface PackagingListResponse {
	packaging: Packaging[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreatePackagingData {
	batch_id: string;
	coa_id?: string;
	moisture_percentage?: number;
	visual_inspection_pass: boolean;
	packaging_integrity: boolean;
	status?: string;
	notes?: string;
	attachments?: string[];
}

export class ERPPackagingService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List packaging runs with optional filters
	 */
	async listPackaging(
		filters: PackagingFilters = {}
	): Promise<PackagingListResponse> {
		try {
			const { batch_id, status, page = 1, limit = 20 } = filters;

			let query = this.supabase
				.from("qa_batch_approvals")
				.select("*", { count: "exact" });

			// Apply filters
			if (batch_id) {
				query = query.eq("batch_id", batch_id);
			}
			if (status) {
				query = query.eq("status", status);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by creation date (newest first)
			query = query.order("created_at", { ascending: false });

			const { data: packaging, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch packaging runs: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				packaging: packaging || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list packaging runs: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single packaging run by ID
	 */
	async getPackagingById(packagingId: string): Promise<Packaging> {
		try {
			const { data: packaging, error } = await this.supabase
				.from("qa_batch_approvals")
				.select("*")
				.eq("id", packagingId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Packaging run not found");
				}
				throw new Error(`Failed to fetch packaging run: ${error.message}`);
			}

			return packaging;
		} catch (error) {
			throw new Error(
				`Failed to get packaging run: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Create a new packaging run
	 */
	async createPackaging(
		data: CreatePackagingData,
		createdBy: string
	): Promise<Packaging> {
		try {
			const packagingData: PackagingInsert = {
				batch_id: data.batch_id,
				coa_id: data.coa_id || null,
				moisture_percentage: data.moisture_percentage || null,
				visual_inspection_pass: data.visual_inspection_pass,
				packaging_integrity: data.packaging_integrity,
				status: data.status || "pending",
				notes: data.notes || null,
				attachments: data.attachments || null,
				approved_by: createdBy,
			};

			const { data: packaging, error } = await this.supabase
				.from("qa_batch_approvals")
				.insert(packagingData)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create packaging run: ${error.message}`);
			}

			return packaging;
		} catch (error) {
			throw new Error(
				`Failed to create packaging run: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if packaging run exists
	 */
	async packagingExists(packagingId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("qa_batch_approvals")
				.select("id")
				.eq("id", packagingId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Check if batch exists (for validation)
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
