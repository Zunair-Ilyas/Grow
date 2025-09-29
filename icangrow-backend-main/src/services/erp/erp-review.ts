import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type BatchRecord = Database["public"]["Tables"]["batch_records"]["Row"];
type BatchRecordUpdate =
	Database["public"]["Tables"]["batch_records"]["Update"];

export interface ReviewBatchData {
	review_notes?: string;
	pass_fail_status: "pass" | "fail" | "conditional";
	rejection_reason?: string;
	requires_reprocessing?: boolean;
}

export class ERPReviewService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * Get batch record by batch ID
	 */
	async getBatchRecord(batchId: string): Promise<BatchRecord> {
		try {
			const { data: batchRecord, error } = await this.supabase
				.from("batch_records")
				.select("*")
				.eq("batch_id", batchId)
				.single();

			if (error) {
				if (error.code === "PGRST116") {
					throw new Error("Batch record not found");
				}
				throw new Error(`Failed to fetch batch record: ${error.message}`);
			}

			return batchRecord;
		} catch (error) {
			throw new Error(
				`Failed to get batch record: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Review and sign-off a batch (QA sign-off and close batch)
	 */
	async reviewBatch(
		batchId: string,
		reviewData: ReviewBatchData,
		reviewerId: string
	): Promise<BatchRecord> {
		try {
			// First, check if batch record exists
			const existingRecord = await this.getBatchRecord(batchId);

			const updateData: BatchRecordUpdate = {
				review_completed_at: new Date().toISOString(),
				review_notes: reviewData.review_notes || null,
				reviewer: reviewerId,
				status:
					reviewData.pass_fail_status === "pass"
						? "approved"
						: reviewData.pass_fail_status === "fail"
						? "rejected"
						: "conditional",
				rejection_reason: reviewData.rejection_reason || null,
			};

			// If it's a pass, mark quality standards as met
			if (reviewData.pass_fail_status === "pass") {
				updateData.quality_standards_met = true;
				updateData.regulatory_requirements_met = true;
				updateData.approval_date = new Date().toISOString();
			} else if (reviewData.pass_fail_status === "fail") {
				updateData.quality_standards_met = false;
				updateData.regulatory_requirements_met = false;
			}

			const { data: batchRecord, error } = await this.supabase
				.from("batch_records")
				.update(updateData)
				.eq("batch_id", batchId)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to review batch: ${error.message}`);
			}

			// If batch is approved, also update the batch status to completed
			if (reviewData.pass_fail_status === "pass") {
				await this.supabase
					.from("batches")
					.update({
						status: "completed",
						current_stage: "packaging",
					})
					.eq("id", batchId);
			}

			return batchRecord;
		} catch (error) {
			throw new Error(
				`Failed to review batch: ${
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

	/**
	 * Check if batch record exists
	 */
	async batchRecordExists(batchId: string): Promise<boolean> {
		try {
			const { data, error } = await this.supabase
				.from("batch_records")
				.select("id")
				.eq("batch_id", batchId)
				.single();

			return !error && !!data;
		} catch (error) {
			return false;
		}
	}
}
