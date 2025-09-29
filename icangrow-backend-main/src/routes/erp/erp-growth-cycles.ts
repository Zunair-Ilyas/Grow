import express from "express";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import {
	createGrowthCycleSchema,
	updateGrowthCycleSchema,
	growthCycleFiltersSchema,
} from "@/utils/erp-validation";
import { ERPGrowthCyclesService } from "@/services/erp/erp-growth-cycles";

const router = express.Router();
const service = new ERPGrowthCyclesService();

// GET /api/v1/erp/growth_cycles
router.get(
	"/",
	authenticate,
	validateQuery(growthCycleFiltersSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { q, status, start_date_from, start_date_to } = req.query as any;
			const page = Number((req.query as any).page ?? 1);
			const limit = Number((req.query as any).limit ?? 20);
			const result = await service.list({
				q,
				status,
				start_date_from,
				start_date_to,
				page,
				limit,
			});
			res.json({ success: true, data: result });
			return;
		} catch (err) {
			next(err);
		}
	}
);

// GET /api/v1/erp/growth_cycles/:id
router.get("/:id", authenticate, async (req, res, next): Promise<void> => {
	try {
		const { id } = req.params;
		if (!id) {
			res
				.status(400)
				.json({ success: false, error: "Growth cycle ID is required" });
			return;
		}
		const cycle = await service.getById(id);
		res.json({ success: true, data: cycle });
		return;
	} catch (err) {
		next(err);
	}
});

// POST /api/v1/erp/growth_cycles
router.post(
	"/",
	authenticate,
	requireRole(["admin", "cultivation_lead"]),
	validate(createGrowthCycleSchema),
	async (req, res, next): Promise<void> => {
		try {
			const created_by = req.user!.userId;
			const payload = req.body;
			const cycle = await service.create({ ...payload, created_by });
			res.status(201).json({ success: true, data: cycle });
			return;
		} catch (err) {
			next(err);
		}
	}
);

// PUT /api/v1/erp/growth_cycles/:id
router.put(
	"/:id",
	authenticate,
	requireRole(["admin", "cultivation_lead"]),
	validate(updateGrowthCycleSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id) {
				res
					.status(400)
					.json({ success: false, error: "Growth cycle ID is required" });
				return;
			}
			const updated = await service.update(id, req.body);
			res.json({ success: true, data: updated });
			return;
		} catch (err) {
			next(err);
		}
	}
);

// DELETE /api/v1/erp/growth_cycles/:id
router.delete(
	"/:id",
	authenticate,
	requireRole(["admin"]),
	async (req, res, next): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id) {
				res
					.status(400)
					.json({ success: false, error: "Growth cycle ID is required" });
				return;
			}
			await service.remove(id);
			res.json({ success: true });
			return;
		} catch (err) {
			next(err);
		}
	}
);

export default router;
