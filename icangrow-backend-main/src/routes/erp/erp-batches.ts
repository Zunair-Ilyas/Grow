import express from "express";
import { ERPBatchesService } from "@/services/erp/erp-batches";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import {
	createBatchSchema,
	updateBatchSchema,
	batchFiltersSchema,
} from "@/utils/erp-validation";

const router: express.Router = express.Router();
const erpBatchesService = new ERPBatchesService();

// @route   GET /api/v1/erp/batches
// @desc    List batches with optional filters
// @access  Private (authenticated users)
router.get(
	"/",
	authenticate,
	validateQuery(batchFiltersSchema),
	async (req, res, next) => {
		try {
			const filters = {
				stage: req.query.stage as string,
				location_id: req.query.location_id as string,
				strain_name: req.query.strain_name as string,
				status: req.query.status as string,
				cycle_id: req.query.cycle_id as string,
				room: req.query.room as string,
				page: req.query.page ? parseInt(req.query.page as string) : 1,
				limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
			};

			const result = await erpBatchesService.listBatches(filters);

			res.json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   GET /api/v1/erp/batches/:batchId
// @desc    Get batch details by ID
// @access  Private (authenticated users)
router.get("/:batchId", authenticate, async (req, res, next): Promise<void> => {
	try {
		const { batchId } = req.params;

		if (!batchId) {
			res.status(400).json({
				success: false,
				error: "Batch ID is required",
			});
			return;
		}

		const batch = await erpBatchesService.getBatchById(batchId);

		res.json({
			success: true,
			data: batch,
		});
	} catch (error) {
		next(error);
	}
});

// @route   POST /api/v1/erp/batches
// @desc    Create a new batch
// @access  Private (grower role and above)
router.post(
	"/",
	authenticate,
	requireRole(["grower", "admin"]),
	validate(createBatchSchema),
	async (req, res, next): Promise<void> => {
		try {
			const batchData = req.body;
			const createdBy = req.user!.userId;

			const batch = await erpBatchesService.createBatch(batchData, createdBy);

			res.status(201).json({
				success: true,
				message: "Batch created successfully",
				data: batch,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   PUT /api/v1/erp/batches/:batchId
// @desc    Update an existing batch
// @access  Private (grower role and above)
router.put(
	"/:batchId",
	authenticate,
	requireRole(["grower", "admin"]),
	validate(updateBatchSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { batchId } = req.params;
			const updateData = req.body;

			if (!batchId) {
				res.status(400).json({
					success: false,
					error: "Batch ID is required",
				});
				return;
			}

			// Check if batch exists
			const exists = await erpBatchesService.batchExists(batchId);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "Batch not found",
				});
				return;
			}

			const batch = await erpBatchesService.updateBatch(batchId, updateData);

			res.json({
				success: true,
				message: "Batch updated successfully",
				data: batch,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   DELETE /api/v1/erp/batches/:batchId
// @desc    Delete a batch
// @access  Private (admin role only)
router.delete(
	"/:batchId",
	authenticate,
	requireRole(["admin"]),
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

			// Check if batch exists
			const exists = await erpBatchesService.batchExists(batchId);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "Batch not found",
				});
				return;
			}

			await erpBatchesService.deleteBatch(batchId);

			res.json({
				success: true,
				message: "Batch deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	}
);

export default router;
