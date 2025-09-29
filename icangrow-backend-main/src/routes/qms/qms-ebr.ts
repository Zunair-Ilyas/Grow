import { Router, Request, Response } from "express";
import { QMSEbrService } from "@/services/qms/qms-ebr";
import { ebrFiltersSchema } from "@/utils/qms-validation";
import {
	createEbrSchema,
	ebrChecklistItemSchema,
	updateEbrChecklistItemSchema,
	ebrApprovalSchema,
	ebrRejectionSchema,
} from "@/utils/qms-validation";
import { authenticate, requireRole } from "@/middleware/auth";

const router: Router = Router();
const ebrService = new QMSEbrService();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/qms/ebr
 * @desc List eBR records with optional filters
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			// Validate query parameters
			const filters = ebrFiltersSchema.parse(req.query);

			const result = await ebrService.listEbrRecords(filters);

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
 * @route GET /api/v1/qms/ebr/:ebr_id
 * @desc Get a single eBR record by ID
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/:ebr_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { ebr_id } = req.params;

			if (!ebr_id) {
				res.status(400).json({
					success: false,
					error: "eBR ID is required",
				});
				return;
			}

			const ebr_record = await ebrService.getEbrRecordById(ebr_id);

			res.json({
				success: true,
				data: ebr_record,
			});
		} catch (error) {
			if (error instanceof Error && error.message === "eBR record not found") {
				res.status(404).json({
					success: false,
					error: "eBR record not found",
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
 * @route GET /api/v1/qms/ebr/batch/:batch_id
 * @desc Get eBR record for a specific batch
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

			const ebr_record = await ebrService.getEbrRecordByBatch(batch_id);

			if (!ebr_record) {
				res.status(404).json({
					success: false,
					error: "No eBR record found for this batch",
				});
				return;
			}

			res.json({
				success: true,
				data: ebr_record,
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
 * @route GET /api/v1/qms/ebr/:ebr_id/checklist
 * @desc Get eBR checklist items
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/:ebr_id/checklist",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { ebr_id } = req.params;

			if (!ebr_id) {
				res.status(400).json({
					success: false,
					error: "eBR ID is required",
				});
				return;
			}

			// Check if eBR record exists
			const exists = await ebrService.ebrRecordExists(ebr_id);
			if (!exists) {
				res.status(404).json({
					success: false,
					error: "eBR record not found",
				});
				return;
			}

			const checklist = await ebrService.getEbrChecklist(ebr_id);

			res.json({
				success: true,
				data: checklist,
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
 * @route GET /api/v1/qms/ebr/:ebr_id/details
 * @desc Get comprehensive eBR details including checklist and signatures
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/:ebr_id/details",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { ebr_id } = req.params;

			if (!ebr_id) {
				res.status(400).json({
					success: false,
					error: "eBR ID is required",
				});
				return;
			}

			const details = await ebrService.getEbrDetails(ebr_id);

			res.json({
				success: true,
				data: details,
			});
		} catch (error) {
			if (error instanceof Error && error.message === "eBR record not found") {
				res.status(404).json({
					success: false,
					error: "eBR record not found",
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
 * @route GET /api/v1/qms/ebr/statistics/overview
 * @desc Get eBR statistics overview
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/statistics/overview",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const statistics = await ebrService.getEbrStatistics();

			res.json({
				success: true,
				data: statistics,
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
 * @route POST /api/v1/qms/ebr
 * @desc Create a new eBR record
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			// Validate request body
			const validatedData = createEbrSchema.parse(req.body);
			const created_by = req.user?.userId;

			if (!created_by) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const ebr_record = await ebrService.createEbrRecord({
				batch_id: validatedData.batch_id,
				created_by,
			});

			res.status(201).json({
				success: true,
				data: ebr_record,
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
 * @route POST /api/v1/qms/ebr/:ebr_id/checklist
 * @desc Add a checklist item to an eBR record
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/:ebr_id/checklist",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { ebr_id } = req.params;
			const validatedData = ebrChecklistItemSchema.parse(req.body);
			const reviewer_id = req.user?.userId;

			if (!reviewer_id) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const checklist_item_result = await ebrService.addEbrChecklistItem({
				ebr_id,
				reviewer_id,
				...validatedData,
			});

			res.status(201).json({
				success: true,
				data: checklist_item_result,
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
 * @route PUT /api/v1/qms/ebr/checklist/:item_id
 * @desc Update a checklist item
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.put(
	"/checklist/:item_id",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { item_id } = req.params;
			const updateData = updateEbrChecklistItemSchema.parse(req.body);

			const checklist_item = await ebrService.updateEbrChecklistItem(
				item_id,
				updateData
			);

			res.json({
				success: true,
				data: checklist_item,
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

			if (error instanceof Error && error.message.includes("not found")) {
				res.status(404).json({
					success: false,
					error: error.message,
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
 * @route GET /api/v1/qms/ebr/debug/list
 * @desc Debug endpoint to list all eBR records
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.get(
	"/debug/list",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const ebrRecords = await ebrService.debugListEbrRecords();

			res.json({
				success: true,
				data: ebrRecords,
				count: ebrRecords?.length || 0,
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
 * @route POST /api/v1/qms/ebr/:ebr_id/approve
 * @desc Approve an eBR record
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/:ebr_id/approve",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { ebr_id } = req.params;
			const validatedData = ebrApprovalSchema.parse(req.body);
			const approverId = req.user?.userId;

			if (!approverId) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const ebr_record = await ebrService.approveEbrRecord(
				ebr_id,
				approverId,
				validatedData.approval_reason
			);

			res.json({
				success: true,
				data: ebr_record,
				message: "eBR record approved successfully",
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

			if (error instanceof Error && error.message.includes("not found")) {
				res.status(404).json({
					success: false,
					error: error.message,
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
 * @route POST /api/v1/qms/ebr/:ebr_id/reject
 * @desc Reject an eBR record
 * @access Private (admin, qa_manager, cultivation_lead)
 */
router.post(
	"/:ebr_id/reject",
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const { ebr_id } = req.params;
			const validatedData = ebrRejectionSchema.parse(req.body);
			const rejectorId = req.user?.userId;

			if (!rejectorId) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const ebr_record = await ebrService.rejectEbrRecord(
				ebr_id,
				rejectorId,
				validatedData.rejection_reason,
				validatedData.requires_reprocessing
			);

			res.json({
				success: true,
				data: ebr_record,
				message: "eBR record rejected successfully",
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

			if (error instanceof Error && error.message.includes("not found")) {
				res.status(404).json({
					success: false,
					error: error.message,
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

export default router;
