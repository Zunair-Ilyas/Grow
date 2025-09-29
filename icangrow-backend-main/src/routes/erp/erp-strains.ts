import express from "express";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import {
	createStrainSchema,
	updateStrainSchema,
	strainFiltersSchema,
} from "@/utils/erp-validation";
import { ERPStrainsService } from "@/services/erp/erp-strains";

const router: express.Router = express.Router();
const strainsService = new ERPStrainsService();

// GET /api/v1/erp/strains
router.get(
	"/",
	authenticate,
	validateQuery(strainFiltersSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { q, is_active } = req.query as any;
			const page = Number((req.query as any).page ?? 1);
			const limit = Number((req.query as any).limit ?? 20);
			const result = await strainsService.listStrains({
				q,
				is_active,
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

// GET /api/v1/erp/strains/:id
router.get("/:id", authenticate, async (req, res, next): Promise<void> => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ success: false, error: "Strain ID is required" });
			return;
		}
		const strain = await strainsService.getStrainById(id);
		res.json({ success: true, data: strain });
		return;
	} catch (err) {
		next(err);
	}
});

// POST /api/v1/erp/strains
router.post(
	"/",
	authenticate,
	requireRole(["admin", "cultivation_lead"]),
	validate(createStrainSchema),
	async (req, res, next): Promise<void> => {
		try {
			const createdBy = req.user!.userId;
			const payload = req.body;
			const strain = await strainsService.createStrain({
				...payload,
				created_by: createdBy,
			});
			res.status(201).json({ success: true, data: strain });
			return;
		} catch (err) {
			next(err);
		}
	}
);

// PUT /api/v1/erp/strains/:id
router.put(
	"/:id",
	authenticate,
	requireRole(["admin", "cultivation_lead"]),
	validate(updateStrainSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id) {
				res
					.status(400)
					.json({ success: false, error: "Strain ID is required" });
				return;
			}
			const updated = await strainsService.updateStrain(id, req.body);
			res.json({ success: true, data: updated });
			return;
		} catch (err) {
			next(err);
		}
	}
);

// PATCH /api/v1/erp/strains/:id (partial update)
router.patch(
	"/:id",
	authenticate,
	requireRole(["admin", "cultivation_lead"]),
	validate(updateStrainSchema),
	async (req, res, next): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id) {
				res.status(400).json({ success: false, error: "Strain ID is required" });
				return;
			}
			const updated = await strainsService.updateStrain(id, req.body);
			res.json({ success: true, data: updated });
			return;
		} catch (err) {
			next(err);
		}
	}
);

// DELETE /api/v1/erp/strains/:id
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
					.json({ success: false, error: "Strain ID is required" });
				return;
			}
			await strainsService.deleteStrain(id);
			res.json({ success: true });
			return;
		} catch (err) {
			next(err);
		}
	}
);

export default router;
