import express from "express";
import { ERPFinishedGoodsService } from "@/services/erp/erp-finished-goods";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import {
	updateFinishedGoodsSchema,
	finishedGoodsFiltersSchema,
} from "@/utils/erp-validation";

const router: express.Router = express.Router();
const erpFinishedGoodsService = new ERPFinishedGoodsService();

// @route   GET /api/v1/erp/finished_goods
// @desc    List finished goods with optional filters
// @access  Private (authenticated users)
router.get(
	"/",
	authenticate,
	validateQuery(finishedGoodsFiltersSchema),
	async (req, res, next) => {
		try {
			const filters = {
				strain_name: req.query.strain_name as string,
				qa_status: req.query.qa_status as string,
				batch_id: req.query.batch_id as string,
				storage_location: req.query.storage_location as string,
				page: req.query.page ? parseInt(req.query.page as string) : 1,
				limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
			};

			const result = await erpFinishedGoodsService.listFinishedGoods(filters);

			res.json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   GET /api/v1/erp/finished_goods/:itemId
// @desc    Get finished goods item details by ID
// @access  Private (authenticated users)
router.get("/:itemId", authenticate, async (req, res, next): Promise<void> => {
	try {
		const { itemId } = req.params;

		if (!itemId) {
			res.status(400).json({
				success: false,
				error: "Item ID is required",
			});
			return;
		}

		const finishedGoods = await erpFinishedGoodsService.getFinishedGoodsById(
			itemId
		);

		res.json({
			success: true,
			data: finishedGoods,
		});
	} catch (error) {
		next(error);
	}
});

// @route   PUT /api/v1/erp/finished_goods/:itemId
// @desc    Update an existing finished goods item
// @access  Private (warehouse_manager role and above)
router.put(
	"/:itemId",
	authenticate,
	requireRole(["warehouse_manager", "admin"]),
	validate(updateFinishedGoodsSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { itemId } = req.params;
			const updateData = req.body;

			if (!itemId) {
				res.status(400).json({
					success: false,
					error: "Item ID is required",
				});
				return;
			}

			// Check if finished goods item exists
			const exists = await erpFinishedGoodsService.finishedGoodsExists(itemId);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "Finished goods item not found",
				});
				return;
			}

			const finishedGoods = await erpFinishedGoodsService.updateFinishedGoods(
				itemId,
				updateData
			);

			res.json({
				success: true,
				message: "Finished goods item updated successfully",
				data: finishedGoods,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   DELETE /api/v1/erp/finished_goods/:itemId
// @desc    Delete a finished goods item
// @access  Private (admin role only)
router.delete(
	"/:itemId",
	authenticate,
	requireRole(["admin"]),
	async (req, res, next): Promise<void> => {
		try {
			const { itemId } = req.params;
			if (!itemId) {
				res.status(400).json({ success: false, error: "Item ID is required" });
				return;
			}

			// Check if item exists
			const exists = await erpFinishedGoodsService.finishedGoodsExists(itemId);
			if (!exists) {
				res.status(404).json({ success: false, error: "Finished goods item not found" });
				return;
			}

			await erpFinishedGoodsService.deleteFinishedGoods(itemId);
			res.json({ success: true, message: "Finished goods item deleted successfully" });
		} catch (error) {
			next(error);
		}
	}
);

export default router;
