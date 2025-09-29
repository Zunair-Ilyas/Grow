import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type TrainingRecord = Database["public"]["Tables"]["training_records"]["Row"];
type TrainingRecordInsert =
	Database["public"]["Tables"]["training_records"]["Insert"];
type TrainingRecordUpdate =
	Database["public"]["Tables"]["training_records"]["Update"];
type Sop = Database["public"]["Tables"]["sops"]["Row"];

export interface TrainingFilters {
	user_id?: string;
	training_type?: string;
	status?: string;
	sop_id?: string;
	q?: string;
	page?: number;
	limit?: number;
}

export interface TrainingListResponse {
	training_records: TrainingRecordWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface TrainingRecordWithDetails extends TrainingRecord {
	user_profile?: {
		full_name: string;
		role: string;
	};
	trainer_profile?: {
		full_name: string;
		role: string;
	};
	sop?: {
		title: string;
		sop_number: string;
		version: string | null;
		category: string;
		content: string | null;
	};
}

export interface CreateTrainingData {
	user_id: string;
	sop_id: string;
	training_type: string;
	title: string;
	trainer_id?: string;
	expiry_date?: string;
	notes?: string;
}

export interface UpdateTrainingData {
	training_type?: string;
	title?: string;
	trainer_id?: string;
	completion_date?: string;
	expiry_date?: string;
	score?: number;
	status?: string;
	certificate_url?: string;
	notes?: string;
}

export class QMSTrainingService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List training records with optional filters
	 */
	async listTrainingRecords(
		filters: TrainingFilters = {}
	): Promise<TrainingListResponse> {
		try {
			const {
				user_id,
				training_type,
				status,
				sop_id,
				q,
				page = 1,
				limit = 20,
			} = filters;

			let query = this.supabase.from("training_records").select(
				`
					*,
					user_profile:profiles!training_records_user_id_fkey(full_name, role),
					trainer_profile:profiles!training_records_trainer_id_fkey(full_name, role),
					sop:sops(title, sop_number, version, category, content)
				`,
				{ count: "exact" }
			);

			// Apply filters
			if (user_id) {
				query = query.eq("user_id", user_id);
			}
			if (training_type) {
				query = query.eq("training_type", training_type);
			}
			if (status) {
				query = query.eq("status", status);
			}
			if (sop_id) {
				query = query.eq("sop_id", sop_id);
			}
			if (q) {
				query = query.or(
					`title.ilike.%${q}%,training_type.ilike.%${q}%,notes.ilike.%${q}%`
				);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by created_at (newest first)
			query = query.order("created_at", { ascending: false });

			const { data: training_records, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch training records: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				training_records: training_records || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list training records: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single training record by ID
	 */
	async getTrainingRecordById(
		trainingId: string
	): Promise<TrainingRecordWithDetails> {
		try {
			const { data: training_record, error } = await this.supabase
				.from("training_records")
				.select(
					`
					*,
					user_profile:profiles!training_records_user_id_fkey(full_name, role),
					trainer_profile:profiles!training_records_trainer_id_fkey(full_name, role),
					sop:sops(title, sop_number, version, category, content)
				`
				)
				.eq("id", trainingId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Training record not found");
				}
				throw new Error(`Failed to fetch training record: ${error.message}`);
			}

			return training_record;
		} catch (error) {
			throw new Error(
				`Failed to get training record: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Create a new training record
	 */
	async createTrainingRecord(
		data: CreateTrainingData
	): Promise<TrainingRecord> {
		try {
			const trainingData: TrainingRecordInsert = {
				user_id: data.user_id,
				sop_id: data.sop_id,
				training_type: data.training_type,
				title: data.title,
				trainer_id: data.trainer_id || null,
				expiry_date: data.expiry_date || null,
				notes: data.notes || null,
				status: "scheduled",
			};

			const { data: training_record, error } = await this.supabase
				.from("training_records")
				.insert(trainingData)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create training record: ${error.message}`);
			}

			return training_record;
		} catch (error) {
			throw new Error(
				`Failed to create training record: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Update an existing training record
	 */
	async updateTrainingRecord(
		trainingId: string,
		data: UpdateTrainingData
	): Promise<TrainingRecord> {
		try {
			const updateData: TrainingRecordUpdate = {};

			// Only include fields that are provided
			if (data.training_type !== undefined)
				updateData.training_type = data.training_type;
			if (data.title !== undefined) updateData.title = data.title;
			if (data.trainer_id !== undefined)
				updateData.trainer_id = data.trainer_id;
			if (data.completion_date !== undefined)
				updateData.completion_date = data.completion_date;
			if (data.expiry_date !== undefined)
				updateData.expiry_date = data.expiry_date;
			if (data.score !== undefined) updateData.score = data.score;
			if (data.status !== undefined) updateData.status = data.status;
			if (data.certificate_url !== undefined)
				updateData.certificate_url = data.certificate_url;
			if (data.notes !== undefined) updateData.notes = data.notes;

			const { data: training_record, error } = await this.supabase
				.from("training_records")
				.update(updateData)
				.eq("id", trainingId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Training record not found");
				}
				throw new Error(`Failed to update training record: ${error.message}`);
			}

			return training_record;
		} catch (error) {
			throw new Error(
				`Failed to update training record: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Mark training as completed
	 */
	async markTrainingCompleted(
		trainingId: string,
		completionData: {
			completion_date?: string;
			score?: number;
			certificate_url?: string;
			notes?: string;
		}
	): Promise<TrainingRecord> {
		try {
			const updateData: TrainingRecordUpdate = {
				status: "completed",
				completion_date:
					completionData.completion_date ||
					new Date().toISOString().split("T")[0],
				score: completionData.score || null,
				certificate_url: completionData.certificate_url || null,
				notes: completionData.notes || null,
			};

			const { data: training_record, error } = await this.supabase
				.from("training_records")
				.update(updateData)
				.eq("id", trainingId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Training record not found");
				}
				throw new Error(
					`Failed to mark training as completed: ${error.message}`
				);
			}

			return training_record;
		} catch (error) {
			throw new Error(
				`Failed to mark training as completed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if training record exists
	 */
	async trainingRecordExists(trainingId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("training_records")
				.select("id")
				.eq("id", trainingId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get training records for a specific user
	 */
	async getTrainingRecordsByUser(
		userId: string
	): Promise<TrainingRecordWithDetails[]> {
		try {
			const { data: training_records, error } = await this.supabase
				.from("training_records")
				.select(
					`
					*,
					trainer_profile:profiles!training_records_trainer_id_fkey(full_name, role),
					sop:sops(title, sop_number, version, category, content)
				`
				)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(
					`Failed to fetch user training records: ${error.message}`
				);
			}

			return training_records || [];
		} catch (error) {
			throw new Error(
				`Failed to get user training records: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get all users (for employee dropdown)
	 */
	async getUsers(): Promise<
		Array<{ user_id: string; full_name: string; role: string }>
	> {
		try {
			const { data: users, error } = await this.supabase
				.from("profiles")
				.select("user_id, full_name, role")
				.order("full_name", { ascending: true });

			if (error) {
				throw new Error(`Failed to fetch users: ${error.message}`);
			}

			return users || [];
		} catch (error) {
			throw new Error(
				`Failed to get users: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get all SOPs (for SOP dropdown)
	 */
	async getSops(): Promise<Sop[]> {
		try {
			const { data: sops, error } = await this.supabase
				.from("sops")
				.select("*")
				.eq("status", "approved") // Only get approved SOPs
				.order("title", { ascending: true });

			if (error) {
				throw new Error(`Failed to fetch SOPs: ${error.message}`);
			}

			return sops || [];
		} catch (error) {
			throw new Error(
				`Failed to get SOPs: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}
}
