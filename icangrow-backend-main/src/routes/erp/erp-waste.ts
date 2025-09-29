import express from "express";
import { ERPWasteService } from "@/services/erp/erp-waste";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import { createWasteSchema, wasteFiltersSchema } from "@/utils/erp-validation";

const router: express.Router = express.Router();
const erpWasteService = new ERPWasteService();

// @route   GET /api/v1/erp/waste
// @desc    List waste records with optional filters
// @access  Private (authenticated users)
router.get(
	"/",
	authenticate,
	validateQuery(wasteFiltersSchema),
	async (req, res, next) => {
		try {
			const filters = {
				batch_id: req.query.batch_id as string,
				waste_type: req.query.waste_type as string,
				disposal_method: req.query.disposal_method as string,
				date_from: req.query.date_from as string,
				date_to: req.query.date_to as string,
				page: req.query.page ? parseInt(req.query.page as string) : 1,
				limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
			};

			const result = await erpWasteService.listWasteRecords(filters);

			res.json({
				success: true,
				data: result,
				message:
					"Waste management table not implemented yet. Please create a waste_management table in your database.",
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   GET /api/v1/erp/waste/:recordId
// @desc    Get waste record details by ID
// @access  Private (authenticated users)
router.get(
	"/:recordId",
	authenticate,
	async (req, res, next): Promise<void> => {
		try {
			const { recordId } = req.params;

			if (!recordId) {
				res.status(400).json({
					success: false,
					error: "Record ID is required",
				});
				return;
			}

			const wasteRecord = await erpWasteService.getWasteRecordById(recordId);

			res.json({
				success: true,
				data: wasteRecord,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   POST /api/v1/erp/waste
// @desc    Create a new waste record
// @access  Private (grower role and above)
router.post(
	"/",
	authenticate,
	requireRole(["grower", "admin"]),
	validate(createWasteSchema),
	async (req, res, next): Promise<void> => {
		try {
			const wasteData = req.body;
			const createdBy = req.user!.userId;

			// Validate that the batch exists
			const batchExists = await erpWasteService.batchExists(wasteData.batch_id);
			if (!batchExists) {
				res.status(400).json({
					success: false,
					error: "Batch not found",
				});
				return;
			}

			const wasteRecord = await erpWasteService.createWasteRecord(
				wasteData,
				createdBy
			);

			res.status(201).json({
				success: true,
				message: "Waste record created successfully",
				data: wasteRecord,
			});
		} catch (error) {
			next(error);
		}
	}
);

export default router;
