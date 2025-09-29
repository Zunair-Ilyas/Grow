import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type FinishedGoods =
	Database["public"]["Tables"]["finished_goods_inventory"]["Row"];
type FinishedGoodsUpdate =
	Database["public"]["Tables"]["finished_goods_inventory"]["Update"];

export interface FinishedGoodsFilters {
	strain_name?: string;
	qa_status?: string;
	batch_id?: string;
	storage_location?: string;
	page?: number;
	limit?: number;
}

export interface FinishedGoodsListResponse {
	finishedGoods: FinishedGoods[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface UpdateFinishedGoodsData {
	quantity_available?: number;
	quantity_reserved?: number;
	price_per_gram?: number;
	cost_per_gram?: number;
	production_cost?: number;
	total_cost?: number;
	qa_status?: string;
	quarantine_status?: string;
	storage_location?: string;
	package_date?: string;
	expiry_date?: string;
	thc_percentage?: number;
	cbd_percentage?: number;
}

export class ERPFinishedGoodsService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List finished goods with optional filters
	 */
	async listFinishedGoods(
		filters: FinishedGoodsFilters = {}
	): Promise<FinishedGoodsListResponse> {
		try {
			const {
				strain_name,
				qa_status,
				batch_id,
				storage_location,
				page = 1,
				limit = 20,
			} = filters;

			let query = this.supabase
				.from("finished_goods_inventory")
				.select("*", { count: "exact" });

			// Apply filters
			if (strain_name) {
				query = query.ilike("strain", `%${strain_name}%`);
			}
			if (qa_status) {
				query = query.eq("qa_status", qa_status);
			}
			if (batch_id) {
				query = query.eq("batch_id", batch_id);
			}
			if (storage_location) {
				query = query.ilike("storage_location", `%${storage_location}%`);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by creation date (newest first)
			query = query.order("created_at", { ascending: false });

			const { data: finishedGoods, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch finished goods: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				finishedGoods: finishedGoods || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list finished goods: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single finished goods item by ID
	 */
	async getFinishedGoodsById(itemId: string): Promise<FinishedGoods> {
		try {
			const { data: finishedGoods, error } = await this.supabase
				.from("finished_goods_inventory")
				.select("*")
				.eq("id", itemId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Finished goods item not found");
				}
				throw new Error(
					`Failed to fetch finished goods item: ${error.message}`
				);
			}

			return finishedGoods;
		} catch (error) {
			throw new Error(
				`Failed to get finished goods item: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Update an existing finished goods item
	 */
	async updateFinishedGoods(
		itemId: string,
		data: UpdateFinishedGoodsData
	): Promise<FinishedGoods> {
		try {
			const updateData: FinishedGoodsUpdate = {};

			// Only include fields that are provided
			if (data.quantity_available !== undefined)
				updateData.quantity_available = data.quantity_available;
			if (data.quantity_reserved !== undefined)
				updateData.quantity_reserved = data.quantity_reserved;
			if (data.price_per_gram !== undefined)
				updateData.price_per_gram = data.price_per_gram;
			if (data.cost_per_gram !== undefined)
				updateData.cost_per_gram = data.cost_per_gram;
			if (data.production_cost !== undefined)
				updateData.production_cost = data.production_cost;
			if (data.total_cost !== undefined)
				updateData.total_cost = data.total_cost;
			if (data.qa_status !== undefined) updateData.qa_status = data.qa_status;
			if (data.quarantine_status !== undefined)
				updateData.quarantine_status = data.quarantine_status;
			if (data.storage_location !== undefined)
				updateData.storage_location = data.storage_location;
			if (data.package_date !== undefined)
				updateData.package_date = data.package_date;
			if (data.expiry_date !== undefined)
				updateData.expiry_date = data.expiry_date;
			if (data.thc_percentage !== undefined)
				updateData.thc_percentage = data.thc_percentage;
			if (data.cbd_percentage !== undefined)
				updateData.cbd_percentage = data.cbd_percentage;

			const { data: finishedGoods, error } = await this.supabase
				.from("finished_goods_inventory")
				.update(updateData)
				.eq("id", itemId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Finished goods item not found");
				}
				throw new Error(
					`Failed to update finished goods item: ${error.message}`
				);
			}

			return finishedGoods;
		} catch (error) {
			throw new Error(
				`Failed to update finished goods item: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Delete a finished goods item by ID
	 */
	async deleteFinishedGoods(itemId: string): Promise<void> {
		try {
			const { error } = await this.supabase
				.from("finished_goods_inventory")
				.delete()
				.eq("id", itemId);

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Finished goods item not found");
				}
				throw new Error(`Failed to delete finished goods item: ${error.message}`);
			}
		} catch (error) {
			throw new Error(
				`Failed to delete finished goods item: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if finished goods item exists
	 */
	async finishedGoodsExists(itemId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("finished_goods_inventory")
				.select("id")
				.eq("id", itemId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}
}
