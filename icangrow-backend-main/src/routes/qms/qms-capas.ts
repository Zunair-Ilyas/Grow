import { Router, Request, Response } from "express";
import { QMSCapasService } from "@/services/qms/qms-capas";
import {
	createCapasSchema,
	updateCapasSchema,
	capasFiltersSchema,
} from "@/utils/qms-validation";
import { authenticate, requireRole } from "@/middleware/auth";

const router: Router = Router();
const capasService = new QMSCapasService();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/qms/capas
 * @desc List CAPAs with optional filters
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			// Validate query parameters
			const filters = capasFiltersSchema.parse(req.query);

			const result = await capasService.listCapas(filters);

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
 * @route POST /api/v1/qms/capas
 * @desc Add new CAPA
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			// Validate request body
			const capaData = createCapasSchema.parse(req.body);

			// Get user ID from auth middleware
			const userId = req.user?.userId;
			if (!userId) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const capa = await capasService.createCapa(capaData, userId);

			res.status(201).json({
				success: true,
				data: capa,
				message: "CAPA created successfully",
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
 * @route GET /api/v1/qms/capas/:capa_id
 * @desc Get a single CAPA by ID
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/:capa_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { capa_id } = req.params;

			if (!capa_id) {
				res.status(400).json({
					success: false,
					error: "CAPA ID is required",
				});
				return;
			}

			const capa = await capasService.getCapaById(capa_id);

			res.json({
				success: true,
				data: capa,
			});
		} catch (error) {
			if (error instanceof Error && error.message === "CAPA not found") {
				res.status(404).json({
					success: false,
					error: "CAPA not found",
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
 * @route PUT /api/v1/qms/capas/:capa_id
 * @desc Update an existing CAPA
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.put(
	"/:capa_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { capa_id } = req.params;

			if (!capa_id) {
				res.status(400).json({
					success: false,
					error: "CAPA ID is required",
				});
				return;
			}

			// Validate request body
			const updateData = updateCapasSchema.parse(req.body);

			// Check if CAPA exists
			const exists = await capasService.capaExists(capa_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "CAPA not found",
				});
				return;
			}

			const capa = await capasService.updateCapa(capa_id, updateData);

			res.json({
				success: true,
				data: capa,
				message: "CAPA updated successfully",
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

			if (error instanceof Error && error.message === "CAPA not found") {
				res.status(404).json({
					success: false,
					error: "CAPA not found",
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
 * @route POST /api/v1/qms/capas/:capa_id/complete
 * @desc Complete a CAPA
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/:capa_id/complete",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { capa_id } = req.params;

			if (!capa_id) {
				res.status(400).json({
					success: false,
					error: "CAPA ID is required",
				});
				return;
			}

			// Validate completion data
			const completionData = {
				completion_date: req.body.completion_date,
				effectiveness_review: req.body.effectiveness_review,
			};

			// Check if CAPA exists
			const exists = await capasService.capaExists(capa_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "CAPA not found",
				});
				return;
			}

			const capa = await capasService.completeCapa(capa_id, completionData);

			res.json({
				success: true,
				data: capa,
				message: "CAPA completed successfully",
			});
		} catch (error) {
			if (error instanceof Error && error.message === "CAPA not found") {
				res.status(404).json({
					success: false,
					error: "CAPA not found",
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
 * @route GET /api/v1/qms/capas/deviation/:deviation_id
 * @desc Get CAPAs for a specific deviation
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/deviation/:deviation_id",
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

			const capas = await capasService.getCapasByDeviation(deviation_id);

			res.json({
				success: true,
				data: capas,
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
