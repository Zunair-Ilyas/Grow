import express from "express";
import { ERPDailyLogsService } from "@/services/erp/erp-daily-logs";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import {
	createDailyLogSchema,
	updateDailyLogSchema,
	dailyLogFiltersSchema,
} from "@/utils/erp-validation";

const router: express.Router = express.Router();
const erpDailyLogsService = new ERPDailyLogsService();

// @route   GET /api/v1/erp/daily_logs
// @desc    List daily logs with optional filters
// @access  Private (authenticated users)
router.get(
	"/",
	authenticate,
	validateQuery(dailyLogFiltersSchema),
	async (req, res, next) => {
		try {
			const filters = {
				batch_id: req.query.batch_id as string,
				date_from: req.query.date_from as string,
				date_to: req.query.date_to as string,
				stage: req.query.stage as string,
				page: req.query.page ? parseInt(req.query.page as string) : 1,
				limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
			};

			const result = await erpDailyLogsService.listDailyLogs(filters);

			res.json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   GET /api/v1/erp/daily_logs/:logId
// @desc    Get daily log details by ID
// @access  Private (authenticated users)
router.get("/:logId", authenticate, async (req, res, next): Promise<void> => {
	try {
		const { logId } = req.params;

		if (!logId) {
			res.status(400).json({
				success: false,
				error: "Log ID is required",
			});
			return;
		}

		const dailyLog = await erpDailyLogsService.getDailyLogById(logId);

		res.json({
			success: true,
			data: dailyLog,
		});
	} catch (error) {
		next(error);
	}
});

// @route   POST /api/v1/erp/daily_logs
// @desc    Create a new daily log
// @access  Private (grower role and above)
router.post(
	"/",
	authenticate,
	requireRole(["grower", "admin"]),
	validate(createDailyLogSchema),
	async (req, res, next): Promise<void> => {
		try {
			const logData = req.body;
			const loggedBy = req.user!.userId;

			// Validate that the batch exists
			const batchExists = await erpDailyLogsService.batchExists(
				logData.batch_id
			);
			if (!batchExists) {
				res.status(400).json({
					success: false,
					error: "Batch not found",
				});
				return;
			}

			const dailyLog = await erpDailyLogsService.createDailyLog(
				logData,
				loggedBy
			);

			res.status(201).json({
				success: true,
				message: "Daily log created successfully",
				data: dailyLog,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   PUT /api/v1/erp/daily_logs/:logId
// @desc    Update an existing daily log
// @access  Private (grower role and above)
router.put(
	"/:logId",
	authenticate,
	requireRole(["grower", "admin"]),
	validate(updateDailyLogSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { logId } = req.params;
			const updateData = req.body;

			if (!logId) {
				res.status(400).json({
					success: false,
					error: "Log ID is required",
				});
				return;
			}

			// Check if daily log exists
			const exists = await erpDailyLogsService.dailyLogExists(logId);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "Daily log not found",
				});
				return;
			}

			const dailyLog = await erpDailyLogsService.updateDailyLog(
				logId,
				updateData
			);

			res.json({
				success: true,
				message: "Daily log updated successfully",
				data: dailyLog,
			});
		} catch (error) {
			next(error);
		}
	}
);

export default router;
