import { Router, Request, Response } from "express";
import { QMSEnvironmentalService } from "@/services/qms/qms-environmental";
import { environmentalFiltersSchema } from "@/utils/qms-validation";
import { authenticate, requireRole } from "@/middleware/auth";

const router: Router = Router();
const environmentalService = new QMSEnvironmentalService();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/qms/environment
 * @desc List environmental monitoring readings with optional filters
 * @access Private (admin, qa_manager, cultivation_lead, environmental_tech)
 */
router.get(
	"/",
	requireRole([
		"admin",
		"qa_manager",
		"cultivation_lead",
		"environmental_tech",
	]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			// Validate query parameters
			const filters = environmentalFiltersSchema.parse(req.query);

			const result = await environmentalService.listEnvironmentalReadings(
				filters
			);

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
 * @route GET /api/v1/qms/environment/batch/:batch_id
 * @desc Get environmental readings for a specific batch
 * @access Private (admin, qa_manager, cultivation_lead, environmental_tech)
 */
router.get(
	"/batch/:batch_id",
	requireRole([
		"admin",
		"qa_manager",
		"cultivation_lead",
		"environmental_tech",
	]),
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

			const readings =
				await environmentalService.getEnvironmentalReadingsByBatch(batch_id);

			res.json({
				success: true,
				data: readings,
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
 * @route GET /api/v1/qms/environment/room/:room_name
 * @desc Get environmental readings for a specific room
 * @access Private (admin, qa_manager, cultivation_lead, environmental_tech)
 */
router.get(
	"/room/:room_name",
	requireRole([
		"admin",
		"qa_manager",
		"cultivation_lead",
		"environmental_tech",
	]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { room_name } = req.params;

			if (!room_name) {
				res.status(400).json({
					success: false,
					error: "Room name is required",
				});
				return;
			}

			const readings =
				await environmentalService.getEnvironmentalReadingsByRoom(room_name);

			res.json({
				success: true,
				data: readings,
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
 * @route GET /api/v1/qms/environment/summary
 * @desc Get environmental readings summary for a date range
 * @access Private (admin, qa_manager, cultivation_lead, environmental_tech)
 */
router.get(
	"/summary",
	requireRole([
		"admin",
		"qa_manager",
		"cultivation_lead",
		"environmental_tech",
	]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { date_from, date_to, room_name } = req.query;

			if (!date_from || !date_to) {
				res.status(400).json({
					success: false,
					error: "date_from and date_to are required",
				});
				return;
			}

			const summary = await environmentalService.getEnvironmentalSummary(
				date_from as string,
				date_to as string,
				room_name as string
			);

			res.json({
				success: true,
				data: summary,
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
