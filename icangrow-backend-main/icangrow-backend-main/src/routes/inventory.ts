import express from "express";
import { InventoryService } from "../services/inventory";
import { authenticate } from "../middleware/auth";
import { validate, inventoryLotsQuerySchema, stockAdjustmentSchema, quarantineToggleSchema } from "../utils/validation";

const router: express.Router = express.Router();

// @route   GET /api/v1/inventory/lots
// @desc    Get inventory lots with filters and stock levels
// @access  Private
router.get("/lots", authenticate, validate(inventoryLotsQuerySchema, "query"), async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const filters = req.query;
		const result = await inventoryService.getInventoryLots(filters);

		res.status(200).json({
			success: true,
			message: "Inventory lots retrieved successfully",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   GET /api/v1/inventory/lots/:id
// @desc    Get specific lot details with full traceability
// @access  Private
router.get("/lots/:id", authenticate, async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const { id } = req.params;
		const result = await inventoryService.getLotDetails(id);

		res.status(200).json({
			success: true,
			message: "Lot details retrieved successfully",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   GET /api/v1/inventory/lots/:id/movements
// @desc    Get stock movements for a specific lot
// @access  Private
router.get("/lots/:id/movements", authenticate, async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const { id } = req.params;
		const result = await inventoryService.getStockMovements(id);

		res.status(200).json({
			success: true,
			message: "Stock movements retrieved successfully",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   GET /api/v1/inventory/batches/:id
// @desc    Get batch information and traceability
// @access  Private
router.get("/batches/:id", authenticate, async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const { id } = req.params;
		const result = await inventoryService.getBatchInfo(id);

		res.status(200).json({
			success: true,
			message: "Batch information retrieved successfully",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   GET /api/v1/inventory/batches/:id/stages
// @desc    Get batch stages progression
// @access  Private
router.get("/batches/:id/stages", authenticate, async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const { id } = req.params;
		const result = await inventoryService.getBatchStages(id);

		res.status(200).json({
			success: true,
			message: "Batch stages retrieved successfully",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   GET /api/v1/inventory/batches/:id/daily-logs
// @desc    Get recent daily logs for a batch
// @access  Private
router.get("/batches/:id/daily-logs", authenticate, async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const { id } = req.params;
		const limit = parseInt(req.query.limit as string) || 5;
		const result = await inventoryService.getDailyLogs(id, limit);

		res.status(200).json({
			success: true,
			message: "Daily logs retrieved successfully",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   POST /api/v1/inventory/lots/:id/adjust
// @desc    Adjust stock quantity for a lot
// @access  Private
router.post("/lots/:id/adjust", authenticate, validate(stockAdjustmentSchema), async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const { id } = req.params;
		const { quantity, reason, unit_of_measure } = req.body;
		const userId = req.user!.userId;

		const result = await inventoryService.adjustStock(id, {
			quantity,
			reason,
			unit_of_measure,
			performed_by: userId,
		});

		res.status(200).json({
			success: true,
			message: "Stock adjusted successfully",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   PATCH /api/v1/inventory/lots/:id/quarantine
// @desc    Toggle quarantine status for a lot
// @access  Private
router.patch("/lots/:id/quarantine", authenticate, validate(quarantineToggleSchema), async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const { id } = req.params;
		const { action } = req.body; // 'quarantine' or 'release'
		const userId = req.user!.userId;

		const result = await inventoryService.toggleQuarantine(id, action, userId);

		res.status(200).json({
			success: true,
			message: `Lot ${action}d successfully`,
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   GET /api/v1/inventory/stats
// @desc    Get inventory statistics and summary
// @access  Private
router.get("/stats", authenticate, async (req, res, next) => {
	try {
		const inventoryService = new InventoryService();
		const result = await inventoryService.getInventoryStats();

		res.status(200).json({
			success: true,
			message: "Inventory statistics retrieved successfully",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   GET /api/v1/inventory/batches
// @desc    Get all batches
// @access  Private
router.get("/batches", authenticate, async (req, res, next) => {
    try {
        const inventoryService = new InventoryService();
        const result = await inventoryService.getAllBatches();
        res.status(200).json({
            success: true,
            message: "Batches retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

export default router;