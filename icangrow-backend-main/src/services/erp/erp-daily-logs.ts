import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type DailyLog = Database["public"]["Tables"]["daily_logs"]["Row"];
type DailyLogInsert = Database["public"]["Tables"]["daily_logs"]["Insert"];
type DailyLogUpdate = Database["public"]["Tables"]["daily_logs"]["Update"];

export interface DailyLogFilters {
	batch_id?: string;
	date_from?: string;
	date_to?: string;
	stage?: string;
	page?: number;
	limit?: number;
}

export interface DailyLogListResponse {
	dailyLogs: DailyLog[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateDailyLogData {
	batch_id: string;
	date: string;
	stage: string;
	stage_id?: string;
	plant_count?: number;
	previous_plant_count?: number;
	plant_variance?: number;
	plant_variance_percentage?: number;
	temperature?: number;
	humidity?: number;
	ph_level?: number;
	co2_level?: number;
	observations?: string;
	actions?: string;
	actions_taken?: string;
	issues?: string;
	issues_raised?: string;
	activity_types?: string[];
	photos?: string[];
	notes?: string;
}

export interface UpdateDailyLogData {
	date?: string;
	stage?: string;
	stage_id?: string;
	plant_count?: number;
	previous_plant_count?: number;
	plant_variance?: number;
	plant_variance_percentage?: number;
	temperature?: number;
	humidity?: number;
	ph_level?: number;
	co2_level?: number;
	observations?: string;
	actions?: string;
	actions_taken?: string;
	issues?: string;
	issues_raised?: string;
	activity_types?: string[];
	photos?: string[];
	notes?: string;
}

export class ERPDailyLogsService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List daily logs with optional filters
	 */
	async listDailyLogs(
		filters: DailyLogFilters = {}
	): Promise<DailyLogListResponse> {
		try {
			const {
				batch_id,
				date_from,
				date_to,
				stage,
				page = 1,
				limit = 20,
			} = filters;

			let query = this.supabase
				.from("daily_logs")
				.select("*", { count: "exact" });

			// Apply filters
			if (batch_id) {
				query = query.eq("batch_id", batch_id);
			}
			if (stage) {
				query = query.eq("stage", stage);
			}
			if (date_from) {
				query = query.gte("date", date_from);
			}
			if (date_to) {
				query = query.lte("date", date_to);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by date (newest first)
			query = query.order("date", { ascending: false });

			const { data: dailyLogs, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch daily logs: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				dailyLogs: dailyLogs || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list daily logs: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single daily log by ID
	 */
	async getDailyLogById(logId: string): Promise<DailyLog> {
		try {
			const { data: dailyLog, error } = await this.supabase
				.from("daily_logs")
				.select("*")
				.eq("id", logId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Daily log not found");
				}
				throw new Error(`Failed to fetch daily log: ${error.message}`);
			}

			return dailyLog;
		} catch (error) {
			throw new Error(
				`Failed to get daily log: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Create a new daily log
	 */
	async createDailyLog(
		data: CreateDailyLogData,
		loggedBy: string
	): Promise<DailyLog> {
		try {
			const logData: DailyLogInsert = {
				batch_id: data.batch_id,
				date: data.date,
				stage: data.stage as any,
				stage_id: data.stage_id || null,
				plant_count: data.plant_count || null,
				previous_plant_count: data.previous_plant_count || null,
				plant_variance: data.plant_variance || null,
				plant_variance_percentage: data.plant_variance_percentage || null,
				temperature: data.temperature || null,
				humidity: data.humidity || null,
				ph_level: data.ph_level || null,
				co2_level: data.co2_level || null,
				observations: data.observations || null,
				actions: data.actions || null,
				actions_taken: data.actions_taken || null,
				issues: data.issues || null,
				issues_raised: data.issues_raised || null,
				activity_types: data.activity_types || null,
				photos: data.photos || null,
				notes: data.notes || null,
				logged_by: loggedBy,
			};

			const { data: dailyLog, error } = await this.supabase
				.from("daily_logs")
				.insert(logData)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create daily log: ${error.message}`);
			}

			return dailyLog;
		} catch (error) {
			throw new Error(
				`Failed to create daily log: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Update an existing daily log
	 */
	async updateDailyLog(
		logId: string,
		data: UpdateDailyLogData
	): Promise<DailyLog> {
		try {
			const updateData: DailyLogUpdate = {};

			// Only include fields that are provided
			if (data.date !== undefined) updateData.date = data.date;
			if (data.stage !== undefined) updateData.stage = data.stage as any;
			if (data.stage_id !== undefined) updateData.stage_id = data.stage_id;
			if (data.plant_count !== undefined)
				updateData.plant_count = data.plant_count;
			if (data.previous_plant_count !== undefined)
				updateData.previous_plant_count = data.previous_plant_count;
			if (data.plant_variance !== undefined)
				updateData.plant_variance = data.plant_variance;
			if (data.plant_variance_percentage !== undefined)
				updateData.plant_variance_percentage = data.plant_variance_percentage;
			if (data.temperature !== undefined)
				updateData.temperature = data.temperature;
			if (data.humidity !== undefined) updateData.humidity = data.humidity;
			if (data.ph_level !== undefined) updateData.ph_level = data.ph_level;
			if (data.co2_level !== undefined) updateData.co2_level = data.co2_level;
			if (data.observations !== undefined)
				updateData.observations = data.observations;
			if (data.actions !== undefined) updateData.actions = data.actions;
			if (data.actions_taken !== undefined)
				updateData.actions_taken = data.actions_taken;
			if (data.issues !== undefined) updateData.issues = data.issues;
			if (data.issues_raised !== undefined)
				updateData.issues_raised = data.issues_raised;
			if (data.activity_types !== undefined)
				updateData.activity_types = data.activity_types;
			if (data.photos !== undefined) updateData.photos = data.photos;
			if (data.notes !== undefined) updateData.notes = data.notes;

			const { data: dailyLog, error } = await this.supabase
				.from("daily_logs")
				.update(updateData)
				.eq("id", logId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Daily log not found");
				}
				throw new Error(`Failed to update daily log: ${error.message}`);
			}

			return dailyLog;
		} catch (error) {
			throw new Error(
				`Failed to update daily log: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if daily log exists
	 */
	async dailyLogExists(logId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("daily_logs")
				.select("id")
				.eq("id", logId)
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
