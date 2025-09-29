import { z } from "zod";

// QMS SOP Control Schemas
export const createSopSchema = z.object({
	title: z.string().min(1, "Title is required"),
	sop_number: z.string().min(1, "SOP number is required"),
	category: z.string().min(1, "Category is required"),
	description: z.string().optional(),
	version: z.string().min(1).optional(),
	content: z.string().optional(),
	effective_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	review_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	status: z
		.enum(["draft", "review", "approved", "superseded", "obsolete"])
		.default("draft"),
});

export const updateSopSchema = z.object({
	title: z.string().min(1).optional(),
	sop_number: z.string().min(1).optional(),
	category: z.string().min(1).optional(),
	description: z.string().optional(),
	version: z.string().min(1).optional(),
	content: z.string().optional(),
	effective_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	review_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	status: z
		.enum(["draft", "review", "approved", "superseded", "obsolete"])
		.optional(),
});

export const sopFiltersSchema = z.object({
	category: z.string().optional(),
	status: z
		.enum(["draft", "review", "approved", "superseded", "obsolete"])
		.optional(),
	q: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// QMS Training & Competency Schemas (Simple)
export const createTrainingSchema = z.object({
	user_id: z.string().uuid("Invalid user ID"),
	sop_id: z.string().uuid("Invalid SOP ID"),
	training_type: z.string().min(1, "Training type is required"),
	title: z.string().min(1, "Title is required"),
	trainer_id: z.string().uuid("Invalid trainer ID").optional(),
	expiry_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	notes: z.string().optional(),
});

export const updateTrainingSchema = z.object({
	training_type: z.string().min(1).optional(),
	title: z.string().min(1).optional(),
	trainer_id: z.string().uuid("Invalid trainer ID").optional(),
	completion_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	expiry_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	score: z.number().min(0).max(100).optional(),
	status: z
		.enum(["scheduled", "in_progress", "completed", "expired"])
		.optional(),
	certificate_url: z.string().url().optional(),
	notes: z.string().optional(),
});

export const trainingFiltersSchema = z.object({
	user_id: z.string().uuid("Invalid user ID").optional(),
	training_type: z.string().optional(),
	status: z
		.enum(["scheduled", "in_progress", "completed", "expired"])
		.optional(),
	sop_id: z.string().uuid("Invalid SOP ID").optional(),
	q: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// QMS Deviation & CAPA Schemas
export const createDeviationSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	batch_id: z.string().uuid("Invalid batch ID").optional(),
	occurred_at: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format"),
	assignee: z.string().uuid("Invalid assignee ID").optional(),
	corrective_action: z.string().optional(),
	preventive_action: z.string().optional(),
	severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
	status: z.enum(["open", "in_progress", "resolved", "closed"]).default("open"),
});

export const updateDeviationSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	occurred_at: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	assignee: z.string().uuid("Invalid assignee ID").optional(),
	corrective_action: z.string().optional(),
	preventive_action: z.string().optional(),
	severity: z.enum(["low", "medium", "high", "critical"]).optional(),
	status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
	resolved_at: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
});

export const deviationFiltersSchema = z.object({
	batch_id: z.string().uuid("Invalid batch ID").optional(),
	assignee: z.string().uuid("Invalid assignee ID").optional(),
	severity: z.enum(["low", "medium", "high", "critical"]).optional(),
	status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
	q: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createCapasSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	deviation_id: z.string().uuid("Invalid deviation ID").optional(),
	action_type: z
		.enum(["corrective", "preventive", "both"])
		.default("corrective"),
	assignee: z.string().uuid("Invalid assignee ID").optional(),
	due_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
	status: z
		.enum(["open", "in_progress", "completed", "cancelled"])
		.default("open"),
});

export const updateCapasSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	action_type: z.enum(["corrective", "preventive", "both"]).optional(),
	assignee: z.string().uuid("Invalid assignee ID").optional(),
	due_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	completion_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	priority: z.enum(["low", "medium", "high", "critical"]).optional(),
	status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
	effectiveness_review: z.string().optional(),
});

export const capasFiltersSchema = z.object({
	deviation_id: z.string().uuid("Invalid deviation ID").optional(),
	assignee: z.string().uuid("Invalid assignee ID").optional(),
	action_type: z.enum(["corrective", "preventive", "both"]).optional(),
	priority: z.enum(["low", "medium", "high", "critical"]).optional(),
	status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
	q: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// QMS Environmental Monitoring Schemas
export const environmentalFiltersSchema = z.object({
	batch_id: z.string().uuid("Invalid batch ID").optional(),
	room_name: z.string().optional(),
	status: z.string().optional(),
	date_from: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	date_to: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// QMS eBR (Electronic Batch Record) Schemas
export const createEbrSchema = z.object({
	batch_id: z.string().uuid("Invalid batch ID"),
});

export const ebrChecklistItemSchema = z.object({
	checklist_item: z.string().min(1, "Checklist item is required"),
	item_category: z.enum([
		"documentation",
		"deviations",
		"environmental",
		"quality",
		"packaging",
		"testing",
	]),
	is_compliant: z.boolean().optional(),
	comments: z.string().optional(),
	evidence_urls: z.array(z.string().url()).optional(),
});

export const updateEbrChecklistItemSchema = z.object({
	is_compliant: z.boolean().optional(),
	comments: z.string().optional(),
	evidence_urls: z.array(z.string().url()).optional(),
	reviewed_at: z.string().datetime().optional(),
});

export const ebrFiltersSchema = z.object({
	batch_id: z.string().uuid("Invalid batch ID").optional(),
	compliance_status: z.string().optional(),
	pass_fail_status: z.enum(["pass", "fail", "conditional"]).optional(),
	date_from: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	date_to: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	q: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// eBR Approval Schema
export const ebrApprovalSchema = z.object({
	approval_reason: z.string().optional(),
});

// eBR Rejection Schema
export const ebrRejectionSchema = z.object({
	rejection_reason: z.string().min(1, "Rejection reason is required"),
	requires_reprocessing: z.boolean().default(false),
});
