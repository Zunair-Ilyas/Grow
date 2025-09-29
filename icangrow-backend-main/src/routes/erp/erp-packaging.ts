import express from "express";
import { ERPPackagingService } from "@/services/erp/erp-packaging";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import {
	createPackagingSchema,
	packagingFiltersSchema,
} from "@/utils/erp-validation";

const router: express.Router = express.Router();
const erpPackagingService = new ERPPackagingService();

// @route   GET /api/v1/erp/packaging
// @desc    List packaging runs with optional filters
// @access  Private (authenticated users)
router.get(
	"/",
	authenticate,
	validateQuery(packagingFiltersSchema),
	async (req, res, next) => {
		try {
			const filters = {
				batch_id: req.query.batch_id as string,
				status: req.query.status as string,
				page: req.query.page ? parseInt(req.query.page as string) : 1,
				limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
			};

			const result = await erpPackagingService.listPackaging(filters);

			res.json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   GET /api/v1/erp/packaging/:packagingId
// @desc    Get packaging run details by ID
// @access  Private (authenticated users)
router.get(
	"/:packagingId",
	authenticate,
	async (req, res, next): Promise<void> => {
		try {
			const { packagingId } = req.params;

			if (!packagingId) {
				res.status(400).json({
					success: false,
					error: "Packaging ID is required",
				});
				return;
			}

			const packaging = await erpPackagingService.getPackagingById(packagingId);

			res.json({
				success: true,
				data: packaging,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   POST /api/v1/erp/packaging
// @desc    Create a new packaging run
// @access  Private (packaging_dispatch role and above)
router.post(
	"/",
	authenticate,
	requireRole(["packaging_dispatch", "qa_manager", "admin"]),
	validate(createPackagingSchema),
	async (req, res, next): Promise<void> => {
		try {
			const packagingData = req.body;
			const createdBy = req.user!.userId;

			// Validate that the batch exists
			const batchExists = await erpPackagingService.batchExists(
				packagingData.batch_id
			);
			if (!batchExists) {
				res.status(400).json({
					success: false,
					error: "Batch not found",
				});
				return;
			}

			const packaging = await erpPackagingService.createPackaging(
				packagingData,
				createdBy
			);

			res.status(201).json({
				success: true,
				message: "Packaging run created successfully",
				data: packaging,
			});
		} catch (error) {
			next(error);
		}
	}
);

export default router;
