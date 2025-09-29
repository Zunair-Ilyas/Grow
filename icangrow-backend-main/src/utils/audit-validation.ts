import { z } from "zod";

// ==================== AUDIT MANAGEMENT ====================

// Audit Schemas
export const createAuditSchema = z.object({
	title: z.string().min(1, "Audit title is required"),
	type: z.string().min(1, "Audit type is required").default("internal"),
	auditor: z.string().min(1, "Auditor is required"),
	status: z.string().default("scheduled"),
	scheduled_date: z.string().optional(),
	completed_date: z.string().optional(),
	scope: z.string().optional(),
	location: z.string().optional(),
	linked_deviation_ids: z.array(z.string().uuid()).optional(),
	linked_capa_ids: z.array(z.string().uuid()).optional(),
	batch_id: z.string().uuid().optional(),
	cycle_id: z.string().uuid().optional(),
	notes: z.string().optional(),
	documents: z.array(z.string()).optional(),
});

export const updateAuditSchema = z.object({
	title: z.string().min(1, "Audit title is required").optional(),
	type: z.string().min(1, "Audit type is required").optional(),
	auditor: z.string().min(1, "Auditor is required").optional(),
	status: z.string().optional(),
	scheduled_date: z.string().optional(),
	completed_date: z.string().optional(),
	scope: z.string().optional(),
	location: z.string().optional(),
	linked_deviation_ids: z.array(z.string().uuid()).optional(),
	linked_capa_ids: z.array(z.string().uuid()).optional(),
	batch_id: z.string().uuid().optional(),
	cycle_id: z.string().uuid().optional(),
	notes: z.string().optional(),
	documents: z.array(z.string()).optional(),
});

export const auditFiltersSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	status: z.string().optional(),
	type: z.string().optional(),
	auditor: z.string().optional(),
	batch_id: z.string().uuid().optional(),
	cycle_id: z.string().uuid().optional(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
});

// Audit Finding Schemas
export const createAuditFindingSchema = z.object({
	audit_type: z.string().default("internal"),
	finding_type: z.string().default("observation"),
	title: z.string().min(1, "Finding title is required"),
	description: z.string().min(1, "Finding description is required"),
	evidence: z.string().optional(),
	requirement_reference: z.string().optional(),
	batch_id: z.string().uuid().optional(),
	stage_id: z.string().uuid().optional(),
	assigned_to: z.string().uuid().optional(),
	due_date: z.string().optional(),
	corrective_action: z.string().optional(),
	verification_method: z.string().optional(),
	verified_by: z.string().uuid().optional(),
	verified_at: z.string().optional(),
	status: z.string().default("open"),
	auditor_name: z.string().optional(),
	audit_date: z.string().min(1, "Audit date is required"),
});

export const updateAuditFindingSchema = z.object({
	audit_type: z.string().optional(),
	finding_type: z.string().optional(),
	title: z.string().min(1, "Finding title is required").optional(),
	description: z.string().min(1, "Finding description is required").optional(),
	evidence: z.string().optional(),
	requirement_reference: z.string().optional(),
	batch_id: z.string().uuid().optional(),
	stage_id: z.string().uuid().optional(),
	assigned_to: z.string().uuid().optional(),
	due_date: z.string().optional(),
	corrective_action: z.string().optional(),
	verification_method: z.string().optional(),
	verified_by: z.string().uuid().optional(),
	verified_at: z.string().optional(),
	status: z.string().optional(),
	auditor_name: z.string().optional(),
	audit_date: z.string().min(1, "Audit date is required").optional(),
});

// Supplier Audit Schemas
export const createSupplierAuditSchema = z.object({
	supplier_id: z.string().uuid().min(1, "Supplier ID is required"),
	audit_type: z.string().default("qualification"),
	audit_date: z.string().min(1, "Audit date is required"),
	auditor: z.string().uuid().min(1, "Auditor is required"),
	status: z.string().default("scheduled"),
	score: z.number().min(0).max(100).optional(),
	findings_count: z.number().min(0).default(0),
	critical_findings: z.number().min(0).default(0),
	next_audit_date: z.string().optional(),
	certificate_issued: z.boolean().default(false),
	certificate_expiry: z.string().optional(),
	report_url: z.string().url().optional(),
	notes: z.string().optional(),
});

export const updateSupplierAuditSchema = z.object({
	supplier_id: z.string().uuid().min(1, "Supplier ID is required").optional(),
	audit_type: z.string().optional(),
	audit_date: z.string().min(1, "Audit date is required").optional(),
	auditor: z.string().uuid().min(1, "Auditor is required").optional(),
	status: z.string().optional(),
	score: z.number().min(0).max(100).optional(),
	findings_count: z.number().min(0).optional(),
	critical_findings: z.number().min(0).optional(),
	next_audit_date: z.string().optional(),
	certificate_issued: z.boolean().optional(),
	certificate_expiry: z.string().optional(),
	report_url: z.string().url().optional(),
	notes: z.string().optional(),
});

export const supplierAuditFiltersSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	status: z.string().optional(),
	audit_type: z.string().optional(),
	supplier_id: z.string().uuid().optional(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
});
