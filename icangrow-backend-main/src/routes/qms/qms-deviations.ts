import { Router, Request, Response } from "express";
import { QMSDeviationsService } from "@/services/qms/qms-deviations";
import {
	createDeviationSchema,
	updateDeviationSchema,
	deviationFiltersSchema,
} from "@/utils/qms-validation";
import { authenticate, requireRole } from "@/middleware/auth";

const router: Router = Router();
const deviationsService = new QMSDeviationsService();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/qms/deviations
 * @desc List deviations with optional filters
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			// Validate query parameters
			const filters = deviationFiltersSchema.parse(req.query);

			const result = await deviationsService.listDeviations(filters);

			res.json({
				success: true,
				data: result,
			});
		} catch (error) {
			if (error instanceof Error && error.name === "ZodError") {
				res.status(400).json({
					success: false,
					error: "Query validation failed",
					details: JSON.parse(error.message),
				});
				return;
			}

			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route POST /api/v1/qms/deviations
 * @desc Log new deviation
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			// Validate request body
			const deviationData = createDeviationSchema.parse(req.body);

			// Get user ID from auth middleware
			const userId = req.user?.userId;
			if (!userId) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const deviation = await deviationsService.createDeviation(
				deviationData,
				userId
			);

			res.status(201).json({
				success: true,
				data: deviation,
				message: "Deviation logged successfully",
			});
		} catch (error) {
			if (error instanceof Error && error.name === "ZodError") {
				res.status(400).json({
					success: false,
					error: "Validation error",
					details: JSON.parse(error.message),
				});
				return;
			}

			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route GET /api/v1/qms/deviations/:deviation_id
 * @desc Get a single deviation by ID
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/:deviation_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { deviation_id } = req.params;

			if (!deviation_id) {
				res.status(400).json({
					success: false,
					error: "Deviation ID is required",
				});
				return;
			}

			const deviation = await deviationsService.getDeviationById(deviation_id);

			res.json({
				success: true,
				data: deviation,
			});
		} catch (error) {
			if (error instanceof Error && error.message === "Deviation not found") {
				res.status(404).json({
					success: false,
					error: "Deviation not found",
				});
				return;
			}

			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route PUT /api/v1/qms/deviations/:deviation_id
 * @desc Update an existing deviation
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.put(
	"/:deviation_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { deviation_id } = req.params;

			if (!deviation_id) {
				res.status(400).json({
					success: false,
					error: "Deviation ID is required",
				});
				return;
			}

			// Validate request body
			const updateData = updateDeviationSchema.parse(req.body);

			// Check if deviation exists
			const exists = await deviationsService.deviationExists(deviation_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "Deviation not found",
				});
				return;
			}

			const deviation = await deviationsService.updateDeviation(
				deviation_id,
				updateData
			);

			res.json({
				success: true,
				data: deviation,
				message: "Deviation updated successfully",
			});
		} catch (error) {
			if (error instanceof Error && error.name === "ZodError") {
				res.status(400).json({
					success: false,
					error: "Validation error",
					details: JSON.parse(error.message),
				});
				return;
			}

			if (error instanceof Error && error.message === "Deviation not found") {
				res.status(404).json({
					success: false,
					error: "Deviation not found",
				});
				return;
			}

			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route POST /api/v1/qms/deviations/:deviation_id/resolve
 * @desc Resolve a deviation
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/:deviation_id/resolve",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { deviation_id } = req.params;

			if (!deviation_id) {
				res.status(400).json({
					success: false,
					error: "Deviation ID is required",
				});
				return;
			}

			// Validate resolution data
			const resolutionData = {
				corrective_action: req.body.corrective_action,
				preventive_action: req.body.preventive_action,
				resolved_at: req.body.resolved_at,
			};

			// Check if deviation exists
			const exists = await deviationsService.deviationExists(deviation_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "Deviation not found",
				});
				return;
			}

			const deviation = await deviationsService.resolveDeviation(
				deviation_id,
				resolutionData
			);

			res.json({
				success: true,
				data: deviation,
				message: "Deviation resolved successfully",
			});
		} catch (error) {
			if (error instanceof Error && error.message === "Deviation not found") {
				res.status(404).json({
					success: false,
					error: "Deviation not found",
				});
				return;
			}

			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route GET /api/v1/qms/deviations/batch/:batch_id
 * @desc Get deviations for a specific batch
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/batch/:batch_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { batch_id } = req.params;

			if (!batch_id) {
				res.status(400).json({
					success: false,
					error: "Batch ID is required",
				});
				return;
			}

			const deviations = await deviationsService.getDeviationsByBatch(batch_id);

			res.json({
				success: true,
				data: deviations,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

export default router;
