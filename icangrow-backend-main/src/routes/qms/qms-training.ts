import { Router, Request, Response } from "express";
import { QMSTrainingService } from "@/services/qms/qms-training";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import {
	createTrainingSchema,
	updateTrainingSchema,
	trainingFiltersSchema,
} from "@/utils/qms-validation";

const router: Router = Router();
const trainingService = new QMSTrainingService();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/qms/training
 * @desc List training records with optional filters
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	validateQuery(trainingFiltersSchema),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const filters = req.query;
			const result = await trainingService.listTrainingRecords(filters);

			res.json({
				success: true,
				data: result,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route POST /api/v1/qms/training
 * @desc Create a new training record (assign training)
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	validate(createTrainingSchema),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const trainingData = req.body;

			const training = await trainingService.createTrainingRecord(trainingData);

			res.status(201).json({
				success: true,
				data: training,
				message: "Training assigned successfully",
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route GET /api/v1/qms/training/:training_id
 * @desc Get a single training record by ID
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/:training_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { training_id } = req.params;

			if (!training_id) {
				res.status(400).json({
					success: false,
					error: "Training ID is required",
				});
				return;
			}

			const training = await trainingService.getTrainingRecordById(training_id);

			res.json({
				success: true,
				data: training,
			});
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Training record not found"
			) {
				res.status(404).json({
					success: false,
					error: "Training record not found",
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
 * @route PUT /api/v1/qms/training/:training_id
 * @desc Update an existing training record (mark as completed)
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.put(
	"/:training_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	validate(updateTrainingSchema),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { training_id } = req.params;

			if (!training_id) {
				res.status(400).json({
					success: false,
					error: "Training ID is required",
				});
				return;
			}

			// Check if training exists
			const exists = await trainingService.trainingRecordExists(training_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "Training record not found",
				});
				return;
			}

			const updateData = req.body;
			const training = await trainingService.updateTrainingRecord(
				training_id,
				updateData
			);

			res.json({
				success: true,
				data: training,
				message: "Training record updated successfully",
			});
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Training record not found"
			) {
				res.status(404).json({
					success: false,
					error: "Training record not found",
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
 * @route POST /api/v1/qms/training/:training_id/complete
 * @desc Mark training as completed
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/:training_id/complete",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { training_id } = req.params;

			if (!training_id) {
				res.status(400).json({
					success: false,
					error: "Training ID is required",
				});
				return;
			}

			// Check if training exists
			const exists = await trainingService.trainingRecordExists(training_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "Training record not found",
				});
				return;
			}

			const completionData = req.body;
			const training = await trainingService.markTrainingCompleted(
				training_id,
				completionData
			);

			res.json({
				success: true,
				data: training,
				message: "Training marked as completed successfully",
			});
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Training record not found"
			) {
				res.status(404).json({
					success: false,
					error: "Training record not found",
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
 * @route GET /api/v1/qms/training/user/:user_id
 * @desc Get training records for a specific user
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/user/:user_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { user_id } = req.params;

			if (!user_id) {
				res.status(400).json({
					success: false,
					error: "User ID is required",
				});
				return;
			}

			const trainings = await trainingService.getTrainingRecordsByUser(user_id);

			res.json({
				success: true,
				data: trainings,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route GET /api/v1/qms/training/users/list
 * @desc Get all users (for employee dropdown)
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/users/list",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const users = await trainingService.getUsers();

			res.json({
				success: true,
				data: users,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

/**
 * @route GET /api/v1/qms/training/sops/list
 * @desc Get all SOPs (for SOP dropdown)
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/sops/list",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const sops = await trainingService.getSops();

			res.json({
				success: true,
				data: sops,
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
