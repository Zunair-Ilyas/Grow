import { Router, Request, Response } from "express";
import { authenticate, requireRole } from "@/middleware/auth";
import { AuditManagementService } from "@/services/audit/audit-management";
import {
	createAuditSchema,
	updateAuditSchema,
	auditFiltersSchema,
	createAuditFindingSchema,
	updateAuditFindingSchema,
	createSupplierAuditSchema,
	updateSupplierAuditSchema,
	supplierAuditFiltersSchema,
} from "@/utils/audit-validation";

const router: Router = Router();

// ==================== INTERNAL AUDITS ====================

// List audits
router.get(
	"/",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const validatedFilters = auditFiltersSchema.parse(req.query);
			const result = await auditService.listAudits(validatedFilters);

			res.json({
				success: true,
				data: result.audits,
				pagination: {
					total: result.total,
					page: result.page,
					limit: result.limit,
					totalPages: Math.ceil(result.total / result.limit),
				},
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Get audit by ID
router.get(
	"/:audit_id",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const audit = await auditService.getAuditById(audit_id);

			res.json({
				success: true,
				data: audit,
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 500;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Create audit
router.post(
	"/",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const validatedData = createAuditSchema.parse(req.body);
			const createdBy = req.user?.userId;

			if (!createdBy) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const audit = await auditService.createAudit({
				...validatedData,
				created_by: createdBy,
			});

			res.status(201).json({
				success: true,
				data: audit,
				message: "Audit created successfully",
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Update audit
router.put(
	"/:audit_id",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const validatedData = updateAuditSchema.parse(req.body);

			const audit = await auditService.updateAudit(audit_id, validatedData);

			res.json({
				success: true,
				data: audit,
				message: "Audit updated successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 400;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Delete audit
router.delete(
	"/:audit_id",
	authenticate,
	requireRole(["admin", "qa_manager"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			await auditService.deleteAudit(audit_id);

			res.json({
				success: true,
				message: "Audit deleted successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 500;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Start audit
router.post(
	"/:audit_id/start",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const audit = await auditService.startAudit(audit_id);

			res.json({
				success: true,
				data: audit,
				message: "Audit started successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 500;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Complete audit
router.post(
	"/:audit_id/complete",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const { completed_date } = req.body;
			const audit = await auditService.completeAudit(audit_id, completed_date);

			res.json({
				success: true,
				data: audit,
				message: "Audit completed successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 500;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Cancel audit
router.post(
	"/:audit_id/cancel",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const { reason } = req.body;
			const audit = await auditService.cancelAudit(audit_id, reason);

			res.json({
				success: true,
				data: audit,
				message: "Audit cancelled successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 500;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// ==================== AUDIT FINDINGS ====================

// Get audit findings
router.get(
	"/:audit_id/findings",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const findings = await auditService.getAuditFindings(audit_id);

			res.json({
				success: true,
				data: findings,
				count: findings.length,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Add audit finding
router.post(
	"/:audit_id/findings",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const validatedData = createAuditFindingSchema.parse(req.body);
			const createdBy = req.user?.userId;

			if (!createdBy) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const finding = await auditService.addAuditFinding({
				...validatedData,
				audit_id,
				created_by: createdBy,
			});

			res.status(201).json({
				success: true,
				data: finding,
				message: "Audit finding added successfully",
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Update audit finding
router.put(
	"/findings/:finding_id",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { finding_id } = req.params;
			const validatedData = updateAuditFindingSchema.parse(req.body);

			const finding = await auditService.updateAuditFinding(
				finding_id,
				validatedData
			);

			res.json({
				success: true,
				data: finding,
				message: "Audit finding updated successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 400;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Delete audit finding
router.delete(
	"/findings/:finding_id",
	authenticate,
	requireRole(["admin", "qa_manager"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { finding_id } = req.params;
			await auditService.deleteAuditFinding(finding_id);

			res.json({
				success: true,
				message: "Audit finding deleted successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 500;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// ==================== SUPPLIER AUDITS ====================

// List supplier audits
router.get(
	"/suppliers",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const validatedFilters = supplierAuditFiltersSchema.parse(req.query);
			const result = await auditService.listSupplierAudits(validatedFilters);

			res.json({
				success: true,
				data: result.audits,
				pagination: {
					total: result.total,
					page: result.page,
					limit: result.limit,
					totalPages: Math.ceil(result.total / result.limit),
				},
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Get supplier audit by ID
router.get(
	"/suppliers/:audit_id",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const audit = await auditService.getSupplierAuditById(audit_id);

			res.json({
				success: true,
				data: audit,
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 500;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Create supplier audit
router.post(
	"/suppliers",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const validatedData = createSupplierAuditSchema.parse(req.body);
			const createdBy = req.user?.userId;

			if (!createdBy) {
				res.status(401).json({
					success: false,
					error: "User ID not found in token",
				});
				return;
			}

			const audit = await auditService.createSupplierAudit({
				...validatedData,
				created_by: createdBy,
			});

			res.status(201).json({
				success: true,
				data: audit,
				message: "Supplier audit created successfully",
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Update supplier audit
router.put(
	"/suppliers/:audit_id",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			const validatedData = updateSupplierAuditSchema.parse(req.body);

			const audit = await auditService.updateSupplierAudit(
				audit_id,
				validatedData
			);

			res.json({
				success: true,
				data: audit,
				message: "Supplier audit updated successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 400;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// Delete supplier audit
router.delete(
	"/suppliers/:audit_id",
	authenticate,
	requireRole(["admin", "qa_manager"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const { audit_id } = req.params;
			await auditService.deleteSupplierAudit(audit_id);

			res.json({
				success: true,
				message: "Supplier audit deleted successfully",
			});
		} catch (error) {
			const statusCode =
				error instanceof Error && error.message.includes("not found")
					? 404
					: 500;
			res.status(statusCode).json({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
);

// ==================== AUDIT REPORTS ====================

// Get audit summary
router.get(
	"/reports/summary",
	authenticate,
	requireRole(["admin", "qa_manager", "cultivation_lead"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const auditService = new AuditManagementService();
			const summary = await auditService.getAuditSummary();

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
