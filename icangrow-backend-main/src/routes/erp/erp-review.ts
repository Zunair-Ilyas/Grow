import express from "express";
import { ERPReviewService } from "@/services/erp/erp-review";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import { reviewBatchSchema } from "@/utils/erp-validation";

const router: express.Router = express.Router();
const erpReviewService = new ERPReviewService();

// @route   POST /api/v1/erp/review/:batchId
// @desc    QA sign-off and close batch
// @access  Private (qa_manager role and above)
router.post(
	"/:batchId",
	authenticate,
	requireRole(["qa_manager", "admin"]),
	validate(reviewBatchSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { batchId } = req.params;
			const reviewData = req.body;
			const reviewerId = req.user!.userId;

			if (!batchId) {
				res.status(400).json({
					success: false,
					error: "Batch ID is required",
				});
				return;
			}

			// Validate that the batch exists
			const batchExists = await erpReviewService.batchExists(batchId);
			if (!batchExists) {
				res.status(404).json({
					success: false,
					error: "Batch not found",
				});
				return;
			}

			// Check if batch record exists
			const batchRecordExists = await erpReviewService.batchRecordExists(
				batchId
			);
			if (!batchRecordExists) {
				res.status(400).json({
					success: false,
					error:
						"Batch record not found. Please ensure the batch has been properly processed before review.",
				});
				return;
			}

			const batchRecord = await erpReviewService.reviewBatch(
				batchId,
				reviewData,
				reviewerId
			);

			const message =
				reviewData.pass_fail_status === "pass"
					? "Batch approved and closed successfully"
					: reviewData.pass_fail_status === "fail"
					? "Batch rejected"
					: "Batch conditionally approved";

			res.json({
				success: true,
				message,
				data: batchRecord,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   GET /api/v1/erp/review/:batchId
// @desc    Get batch record for review
// @access  Private (qa_manager role and above)
router.get(
	"/:batchId",
	authenticate,
	requireRole(["qa_manager", "admin"]),
	async (req, res, next): Promise<void> => {
		try {
			const { batchId } = req.params;

			if (!batchId) {
				res.status(400).json({
					success: false,
					error: "Batch ID is required",
				});
				return;
			}

			const batchRecord = await erpReviewService.getBatchRecord(batchId);

			res.json({
				success: true,
				data: batchRecord,
			});
		} catch (error) {
			next(error);
		}
	}
);

export default router;
