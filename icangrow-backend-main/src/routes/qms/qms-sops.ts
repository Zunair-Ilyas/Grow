import { Router, Request, Response } from "express";
import { QMSSopsService } from "@/services/qms/qms-sops";
import { authenticate, requireRole } from "@/middleware/auth";
import { validate, validateQuery } from "@/utils/validation";
import {
	createSopSchema,
	updateSopSchema,
	sopFiltersSchema,
} from "@/utils/qms-validation";

const router: Router = Router();
const sopsService = new QMSSopsService();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/qms/sops
 * @desc List SOPs with optional filters
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	validateQuery(sopFiltersSchema),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const filters = req.query;
			const result = await sopsService.listSops(filters);

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
 * @route POST /api/v1/qms/sops
 * @desc Create a new SOP
 * @access Private (admin, qa_manager)
 */
router.post(
	"/",
	requireRole(["admin", "qa_manager"]),
	validate(createSopSchema),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const sopData = req.body;
			const createdBy = req.user?.userId;

			if (!createdBy) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const sop = await sopsService.createSop(sopData, createdBy);

			res.status(201).json({
				success: true,
				data: sop,
				message: "SOP created successfully",
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
 * @route GET /api/v1/qms/sops/:sop_id
 * @desc Get a single SOP by ID
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/:sop_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { sop_id } = req.params;

			if (!sop_id) {
				res.status(400).json({
					success: false,
					error: "SOP ID is required",
				});
				return;
			}

			const sop = await sopsService.getSopById(sop_id);

			res.json({
				success: true,
				data: sop,
			});
		} catch (error) {
			if (error instanceof Error && error.message === "SOP not found") {
				res.status(404).json({
					success: false,
					error: "SOP not found",
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
 * @route PUT /api/v1/qms/sops/:sop_id
 * @desc Update an existing SOP
 * @access Private (admin, qa_manager)
 */
router.put(
	"/:sop_id",
	requireRole(["admin", "qa_manager"]),
	validate(updateSopSchema),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { sop_id } = req.params;

			if (!sop_id) {
				res.status(400).json({
					success: false,
					error: "SOP ID is required",
				});
				return;
			}

			// Check if SOP exists
			const exists = await sopsService.sopExists(sop_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "SOP not found",
				});
				return;
			}

			const updateData = req.body;
			const sop = await sopsService.updateSop(sop_id, updateData);

			res.json({
				success: true,
				data: sop,
				message: "SOP updated successfully",
			});
		} catch (error) {
			if (error instanceof Error && error.message === "SOP not found") {
				res.status(404).json({
					success: false,
					error: "SOP not found",
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
 * @route POST /api/v1/qms/sops/:sop_id/approve
 * @desc Approve an SOP
 * @access Private (admin, qa_manager)
 */
router.post(
	"/:sop_id/approve",
	requireRole(["admin", "qa_manager"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { sop_id } = req.params;
			const approvedBy = req.user?.userId;

			if (!sop_id) {
				res.status(400).json({
					success: false,
					error: "SOP ID is required",
				});
				return;
			}

			if (!approvedBy) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			// Check if SOP exists
			const exists = await sopsService.sopExists(sop_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "SOP not found",
				});
				return;
			}

			const sop = await sopsService.approveSop(sop_id, approvedBy);

			res.json({
				success: true,
				data: sop,
				message: "SOP approved successfully",
			});
		} catch (error) {
			if (error instanceof Error && error.message === "SOP not found") {
				res.status(404).json({
					success: false,
					error: "SOP not found",
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
 * @route GET /api/v1/qms/sops/category/:category
 * @desc Get SOPs by category
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/category/:category",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { category } = req.params;

			if (!category) {
				res.status(400).json({
					success: false,
					error: "Category is required",
				});
				return;
			}

			const sops = await sopsService.getSopsByCategory(category);

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

/**
 * @route GET /api/v1/qms/sops/categories/list
 * @desc Get all SOP categories
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/categories/list",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const categories = await sopsService.getSopCategories();

			res.json({
				success: true,
				data: categories,
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
