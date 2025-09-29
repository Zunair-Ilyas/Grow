import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type QMSEbr = Database["public"]["Tables"]["qms_ebr"]["Row"];

export interface EbrFilters {
	batch_id?: string;
	compliance_status?: string;
	pass_fail_status?: string;
	date_from?: string;
	date_to?: string;
	q?: string;
	page?: number;
	limit?: number;
}

export interface EbrListResponse {
	ebr_records: QMSEbr[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export class QMSEbrService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List eBR records with optional filters
	 */
	async listEbrRecords(filters: EbrFilters = {}): Promise<EbrListResponse> {
		try {
			const {
				batch_id,
				compliance_status,
				pass_fail_status,
				date_from,
				date_to,
				q,
				page = 1,
				limit = 20,
			} = filters;

			let query = this.supabase.from("qms_ebr").select(
				`
					*,
					created_by_profile:profiles!fk_qms_ebr_created_by(full_name, role),
					approved_by_profile:profiles!fk_qms_ebr_approved_by(full_name, role),
					batch:batches(name, strain, current_stage)
				`,
				{ count: "exact" }
			);

			// Apply filters
			if (batch_id) {
				query = query.eq("batch_id", batch_id);
			}
			if (compliance_status) {
				query = query.eq("compliance_status", compliance_status);
			}
			if (pass_fail_status) {
				query = query.eq("pass_fail_status", pass_fail_status);
			}
			if (date_from) {
				query = query.gte("start_date", date_from);
			}
			if (date_to) {
				query = query.lte("start_date", date_to);
			}
			if (q) {
				query = query.or(
					`ebr_number.ilike.%${q}%,batch_name.ilike.%${q}%,strain.ilike.%${q}%,review_notes.ilike.%${q}%`
				);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by created_at (newest first)
			query = query.order("created_at", { ascending: false });

			const { data: ebr_records, error, count } = await query;

			if (error) {
				throw new Error(`Failed to fetch eBR records: ${error.message}`);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				ebr_records: ebr_records || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list eBR records: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get a single eBR record by ID
	 */
	async getEbrRecordById(ebrId: string): Promise<QMSEbr> {
		try {
			// First, let's check if any eBR records exist at all
			const { data: allRecords, error: listError } = await this.supabase
				.from("qms_ebr")
				.select("id, ebr_number, batch_name")
				.limit(5);

			if (listError) {
				console.log("Error listing eBR records:", listError);
			} else {
				console.log("Available eBR records:", allRecords);
			}

			const { data: ebr_record, error } = await this.supabase
				.from("qms_ebr")
				.select(
					`
					*,
					created_by_profile:profiles!fk_qms_ebr_created_by(full_name, role),
					approved_by_profile:profiles!fk_qms_ebr_approved_by(full_name, role),
					batch:batches(name, strain, current_stage)
				`
				)
				.eq("id", ebrId)
				.single();

			if (error) {
				console.log("Error fetching eBR record:", error);
				if (error.code === "PGRST116") {
					throw new Error(
						`eBR record not found. Looking for ID: ${ebrId}. Available records: ${JSON.stringify(
							allRecords || []
						)}`
					);
				}
				throw new Error(`Failed to fetch eBR record: ${error.message}`);
			}

			return ebr_record;
		} catch (error) {
			throw new Error(
				`Failed to get eBR record: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get eBR record by batch ID
	 */
	async getEbrRecordByBatch(batchId: string): Promise<QMSEbr | null> {
		try {
			const { data: ebr_record, error } = await this.supabase
				.from("qms_ebr")
				.select(
					`
					*,
					created_by_profile:profiles!fk_qms_ebr_created_by(full_name, role),
					approved_by_profile:profiles!fk_qms_ebr_approved_by(full_name, role),
					batch:batches(name, strain, current_stage)
				`
				)
				.eq("batch_id", batchId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					return null; // No eBR record found for this batch
				}
				throw new Error(`Failed to fetch eBR record: ${error.message}`);
			}

			return ebr_record;
		} catch (error) {
			throw new Error(
				`Failed to get eBR record by batch: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get eBR checklist items for a specific eBR
	 */
	async getEbrChecklist(ebrId: string): Promise<any[]> {
		try {
			const { data: checklist, error } = await this.supabase
				.from("ebr_review_checklist")
				.select("*")
				.eq("ebr_id", ebrId)
				.order("created_at", { ascending: true });

			if (error) {
				throw new Error(`Failed to fetch eBR checklist: ${error.message}`);
			}

			return checklist || [];
		} catch (error) {
			throw new Error(
				`Failed to get eBR checklist: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get comprehensive eBR details including checklist
	 */
	async getEbrDetails(ebrId: string): Promise<{
		ebr_record: QMSEbr;
		checklist: any[];
	}> {
		try {
			const [ebr_record, checklist] = await Promise.all([
				this.getEbrRecordById(ebrId),
				this.getEbrChecklist(ebrId),
			]);

			return {
				ebr_record,
				checklist,
			};
		} catch (error) {
			throw new Error(
				`Failed to get eBR details: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Check if eBR record exists
	 */
	async ebrRecordExists(ebrId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("qms_ebr")
				.select("id")
				.eq("id", ebrId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get eBR statistics
	 */
	async getEbrStatistics(): Promise<{
		total_records: number;
		pass_count: number;
		fail_count: number;
		conditional_count: number;
		compliance_rate: number;
		average_compliance_score: number;
	}> {
		try {
			const { data: records, error } = await this.supabase
				.from("qms_ebr")
				.select("pass_fail_status, compliance_score");

			if (error) {
				throw new Error(`Failed to fetch eBR statistics: ${error.message}`);
			}

			const total_records = records?.length || 0;
			const pass_count =
				records?.filter((r: any) => r.pass_fail_status === "pass").length || 0;
			const fail_count =
				records?.filter((r: any) => r.pass_fail_status === "fail").length || 0;
			const conditional_count =
				records?.filter((r: any) => r.pass_fail_status === "conditional")
					.length || 0;

			const compliance_rate =
				total_records > 0 ? (pass_count / total_records) * 100 : 0;

			const validScores =
				records
					?.filter((r: any) => r.compliance_score !== null)
					.map((r: any) => r.compliance_score!) || [];
			const average_compliance_score =
				validScores.length > 0
					? validScores.reduce((sum: number, score: number) => sum + score, 0) /
					  validScores.length
					: 0;

			return {
				total_records,
				pass_count,
				fail_count,
				conditional_count,
				compliance_rate: Math.round(compliance_rate * 100) / 100,
				average_compliance_score:
					Math.round(average_compliance_score * 100) / 100,
			};
		} catch (error) {
			throw new Error(
				`Failed to get eBR statistics: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Create a new eBR record
	 */
	async createEbrRecord(data: {
		batch_id: string;
		created_by: string;
	}): Promise<QMSEbr> {
		try {
			// First, fetch the batch details
			const { data: batch, error: batchError } = await this.supabase
				.from("batches")
				.select("name, strain, current_stage, plant_count, start_date")
				.eq("id", data.batch_id)
				.single();

			if (batchError) {
				if (batchError.code === "PGRST116") {
					throw new Error("Batch not found");
				}
				throw new Error(`Failed to fetch batch: ${batchError.message}`);
			}

			// Create eBR record with batch data
			const ebrData = {
				batch_id: data.batch_id,
				batch_name: batch.name,
				strain: batch.strain,
				start_date: batch.start_date || new Date().toISOString().split("T")[0],
				current_stage: batch.current_stage,
				total_plant_count: batch.plant_count,
				created_by: data.created_by,
			};

			const { data: ebr_record, error } = await this.supabase
				.from("qms_ebr")
				.insert(ebrData)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create eBR record: ${error.message}`);
			}

			return ebr_record;
		} catch (error) {
			throw new Error(
				`Failed to create eBR record: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Add a checklist item to an eBR record
	 */
	async addEbrChecklistItem(data: {
		ebr_id: string;
		reviewer_id: string;
		checklist_item: string;
		item_category:
			| "documentation"
			| "deviations"
			| "environmental"
			| "quality"
			| "packaging"
			| "testing";
		is_compliant?: boolean;
		comments?: string;
		evidence_urls?: string[];
	}): Promise<any> {
		try {
			// First, verify that the eBR record exists
			const { data: ebrRecord, error: ebrError } = await this.supabase
				.from("qms_ebr")
				.select("id")
				.eq("id", data.ebr_id)
				.single();

			if (ebrError) {
				if (ebrError.code === "PGRST116") {
					throw new Error("eBR record not found");
				}
				throw new Error(`Failed to verify eBR record: ${ebrError.message}`);
			}

			// Now add the checklist item
			const { data: checklist_item, error } = await this.supabase
				.from("ebr_review_checklist")
				.insert(data)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to add eBR checklist item: ${error.message}`);
			}

			return checklist_item;
		} catch (error) {
			throw new Error(
				`Failed to add eBR checklist item: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Update a checklist item
	 */
	async updateEbrChecklistItem(
		itemId: string,
		data: {
			is_compliant?: boolean;
			comments?: string;
			evidence_urls?: string[];
			reviewed_at?: string;
		}
	): Promise<any> {
		try {
			const { data: checklist_item, error } = await this.supabase
				.from("ebr_review_checklist")
				.update(data)
				.eq("id", itemId)
				.select()
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Checklist item not found");
				}
				throw new Error(
					`Failed to update eBR checklist item: ${error.message}`
				);
			}

			return checklist_item;
		} catch (error) {
			throw new Error(
				`Failed to update eBR checklist item: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Approve an eBR record
	 */
	async approveEbrRecord(
		ebrId: string,
		approverId: string,
		approvalReason?: string
	): Promise<QMSEbr> {
		try {
			// First, verify that the eBR record exists
			const { data: ebrRecord, error: ebrError } = await this.supabase
				.from("qms_ebr")
				.select("id")
				.eq("id", ebrId)
				.single();

			if (ebrError) {
				if (ebrError.code === "PGRST116") {
					throw new Error("eBR record not found");
				}
				throw new Error(`Failed to verify eBR record: ${ebrError.message}`);
			}

			// Update the eBR record with approval
			const { data: updatedEbr, error } = await this.supabase
				.from("qms_ebr")
				.update({
					approved_by: approverId,
					approved_at: new Date().toISOString(),
					pass_fail_status: "pass",
					compliance_status: "approved",
					review_notes: approvalReason,
				})
				.eq("id", ebrId)
				.select(
					`
					*,
					created_by_profile:profiles!fk_qms_ebr_created_by(full_name, role),
					approved_by_profile:profiles!fk_qms_ebr_approved_by(full_name, role),
					batch:batches(name, strain, current_stage)
				`
				)
				.single();

			if (error) {
				throw new Error(`Failed to approve eBR record: ${error.message}`);
			}

			return updatedEbr;
		} catch (error) {
			throw new Error(
				`Failed to approve eBR record: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Reject an eBR record
	 */
	async rejectEbrRecord(
		ebrId: string,
		rejectorId: string,
		rejectionReason: string,
		requiresReprocessing: boolean = false
	): Promise<QMSEbr> {
		try {
			// First, verify that the eBR record exists
			const { data: ebrRecord, error: ebrError } = await this.supabase
				.from("qms_ebr")
				.select("id")
				.eq("id", ebrId)
				.single();

			if (ebrError) {
				if (ebrError.code === "PGRST116") {
					throw new Error("eBR record not found");
				}
				throw new Error(`Failed to verify eBR record: ${ebrError.message}`);
			}

			// Update the eBR record with rejection
			const { data: updatedEbr, error } = await this.supabase
				.from("qms_ebr")
				.update({
					approved_by: rejectorId,
					approved_at: new Date().toISOString(),
					pass_fail_status: "fail",
					compliance_status: "rejected",
					rejection_reason: rejectionReason,
					requires_reprocessing: requiresReprocessing,
					review_notes: rejectionReason,
				})
				.eq("id", ebrId)
				.select(
					`
					*,
					created_by_profile:profiles!fk_qms_ebr_created_by(full_name, role),
					approved_by_profile:profiles!fk_qms_ebr_approved_by(full_name, role),
					batch:batches(name, strain, current_stage)
				`
				)
				.single();

			if (error) {
				throw new Error(`Failed to reject eBR record: ${error.message}`);
			}

			return updatedEbr;
		} catch (error) {
			throw new Error(
				`Failed to reject eBR record: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Debug method to list all eBR records
	 */
	async debugListEbrRecords(): Promise<any[]> {
		try {
			const { data: ebrRecords, error } = await this.supabase
				.from("qms_ebr")
				.select("id, ebr_number, batch_name, created_at")
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(`Failed to fetch eBR records: ${error.message}`);
			}

			return ebrRecords || [];
		} catch (error) {
			throw new Error(
				`Failed to debug list eBR records: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}
}
