import { z } from "zod";

// Growth stage enum validation
const growthStageSchema = z.enum([
	"cloning",
	"vegetative",
	"flowering",
	"harvest",
	"drying",
	"packaging",
]);

// Batch status enum validation
const batchStatusSchema = z.enum(["active", "completed", "archived"]);

// Helper to accept YYYY-MM-DD and ISO, output ISO string
const dateStringToIso = z.string().transform((val) => {
	if (!val) return val as unknown as string;
	// Accept YYYY-MM-DD or full ISO
	const isYmd = /^\d{4}-\d{2}-\d{2}$/.test(val);
	const d = new Date(isYmd ? `${val}T00:00:00Z` : val);
	if (isNaN(d.getTime())) {
		throw new Error("Invalid date");
	}
	return d.toISOString();
});

// Batch creation schema (aligns with public.batches.Insert requireds)
export const createBatchSchema = z.object({
	name: z.string().min(1, "Batch name is required").max(255),
	strain: z.string().min(1, "Strain is required").max(255),
	cycle_id: z.string().uuid("Invalid cycle ID"),
	room: z.string().min(1, "Room is required").max(100),
	plant_count: z
		.number()
		.int()
		.positive("Plant count must be positive")
		.optional(),
	start_date: dateStringToIso.optional(),
	expected_harvest_date: dateStringToIso.optional(),
	notes: z.string().max(1000, "Notes too long").optional(),
	current_stage: growthStageSchema.optional(),
	status: batchStatusSchema.optional(),
});

// Batch update schema
export const updateBatchSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	strain: z.string().min(1).max(255).optional(),
	strain_id: z.string().uuid().optional(),
	cycle_id: z.string().uuid("Invalid cycle ID").optional(),
	room: z.string().min(1).max(100).optional(),
	plant_count: z.number().int().positive().optional(),
	start_date: dateStringToIso.optional(),
	clone_date: dateStringToIso.optional(),
	expected_harvest_date: dateStringToIso.optional(),
	notes: z.string().max(1000).optional(),
	current_stage: growthStageSchema.optional(),
	status: batchStatusSchema.optional(),
	progress: z.number().min(0).max(100).optional(),
});

// Batch query filters schema
export const batchFiltersSchema = z.object({
	stage: growthStageSchema.optional(),
	location_id: z.string().uuid().optional(),
	strain_name: z.string().optional(),
	status: batchStatusSchema.optional(),
	cycle_id: z.string().uuid().optional(),
	room: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// Daily log creation schema
export const createDailyLogSchema = z.object({
	batch_id: z.string().uuid("Invalid batch ID"),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format"),
	stage: growthStageSchema,
	stage_id: z.string().uuid().optional(),
	plant_count: z
		.number()
		.int()
		.positive("Plant count must be positive")
		.optional(),
	previous_plant_count: z
		.number()
		.int()
		.positive("Previous plant count must be positive")
		.optional(),
	plant_variance: z.number().optional(),
	plant_variance_percentage: z.number().min(0).max(100).optional(),
	temperature: z.number().optional(),
	humidity: z.number().min(0).max(100).optional(),
	ph_level: z.number().min(0).max(14).optional(),
	co2_level: z.number().optional(),
	observations: z.string().max(2000, "Observations too long").optional(),
	actions: z.string().max(2000, "Actions too long").optional(),
	actions_taken: z.string().max(2000, "Actions taken too long").optional(),
	issues: z.string().max(2000, "Issues too long").optional(),
	issues_raised: z.string().max(2000, "Issues raised too long").optional(),
	activity_types: z.array(z.string()).optional(),
	photos: z.array(z.string()).optional(),
	notes: z.string().max(2000, "Notes too long").optional(),
});

// Daily log update schema
export const updateDailyLogSchema = createDailyLogSchema
	.partial()
	.omit({ batch_id: true });

// Daily log query filters schema
export const dailyLogFiltersSchema = z.object({
	batch_id: z.string().uuid().optional(),
	date_from: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	date_to: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	stage: growthStageSchema.optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// Packaging creation schema
export const createPackagingSchema = z.object({
	batch_id: z.string().uuid("Invalid batch ID"),
	coa_id: z.string().uuid().optional(),
	moisture_percentage: z.number().min(0).max(100).optional(),
	visual_inspection_pass: z.boolean(),
	packaging_integrity: z.boolean(),
	status: z
		.string()
		.min(1, "Status is required")
		.max(50, "Status too long")
		.default("pending"),
	notes: z.string().max(1000, "Notes too long").optional(),
	attachments: z.array(z.string()).optional(),
});

// Packaging query filters schema
export const packagingFiltersSchema = z.object({
	batch_id: z.string().uuid().optional(),
	status: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// Finished goods update schema
export const updateFinishedGoodsSchema = z.object({
	quantity_available: z
		.number()
		.int()
		.min(0, "Quantity must be non-negative")
		.optional(),
	quantity_reserved: z
		.number()
		.int()
		.min(0, "Quantity must be non-negative")
		.optional(),
	price_per_gram: z.number().positive("Price must be positive").optional(),
	cost_per_gram: z.number().positive("Cost must be positive").optional(),
	production_cost: z
		.number()
		.positive("Production cost must be positive")
		.optional(),
	total_cost: z.number().positive("Total cost must be positive").optional(),
	qa_status: z
		.string()
		.min(1, "QA status is required")
		.max(50, "QA status too long")
		.optional(),
	quarantine_status: z
		.string()
		.max(50, "Quarantine status too long")
		.optional(),
	storage_location: z.string().max(100, "Storage location too long").optional(),
	package_date: z.string().datetime().optional(),
	expiry_date: z.string().datetime().optional(),
	thc_percentage: z.number().min(0).max(100).optional(),
	cbd_percentage: z.number().min(0).max(100).optional(),
});

// Finished goods query filters schema
export const finishedGoodsFiltersSchema = z.object({
	strain_name: z.string().optional(),
	qa_status: z.string().optional(),
	batch_id: z.string().uuid().optional(),
	storage_location: z.string().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// Waste management creation schema
export const createWasteSchema = z.object({
	batch_id: z.string().uuid("Invalid batch ID"),
	waste_type: z
		.string()
		.min(1, "Waste type is required")
		.max(100, "Waste type too long"),
	quantity: z.number().positive("Quantity must be positive"),
	unit: z.string().min(1, "Unit is required").max(20, "Unit too long"),
	reason: z.string().min(1, "Reason is required").max(500, "Reason too long"),
	disposal_method: z
		.string()
		.min(1, "Disposal method is required")
		.max(100, "Disposal method too long"),
	disposal_date: z.string().datetime(),
	notes: z.string().max(1000, "Notes too long").optional(),
	photos: z.array(z.string()).optional(),
});

// Waste query filters schema
export const wasteFiltersSchema = z.object({
	batch_id: z.string().uuid().optional(),
	waste_type: z.string().optional(),
	disposal_method: z.string().optional(),
	date_from: z.string().datetime().optional(),
	date_to: z.string().datetime().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// Review stage schema
export const reviewBatchSchema = z.object({
	review_notes: z.string().max(2000, "Review notes too long").optional(),
	pass_fail_status: z.enum(["pass", "fail", "conditional"]),
	rejection_reason: z.string().max(500, "Rejection reason too long").optional(),
	requires_reprocessing: z.boolean().optional(),
});

// Strains schemas
export const createStrainSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	description: z.string().max(2000).optional(),
	genetics: z.string().max(500).optional(),
	flowering_time_days: z.number().int().positive().optional(),
	is_active: z.boolean().optional(),
});

export const updateStrainSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	description: z.string().max(2000).optional(),
	genetics: z.string().max(500).optional(),
	flowering_time_days: z.number().int().positive().optional(),
	is_active: z.boolean().optional(),
});

export const strainFiltersSchema = z.object({
	q: z.string().optional(),
	is_active: z.coerce.boolean().optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

// Growth cycles enums and schemas
const cycleStatusSchema = z
	.enum(["planning", "active", "completed", "cancelled"])
	.default("planning");

// Strain info schema for growth cycles
const strainInfoSchema = z.object({
	strain_id: z.string().uuid("Invalid strain ID"),
	is_primary: z.boolean(),
});

export const createGrowthCycleSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format"),
	end_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.nullable()
		.optional(),
	strains: z
		.array(strainInfoSchema)
		.min(1, "At least one strain required")
		.refine(
			(strains) => strains.some((strain) => strain.is_primary),
			"At least one strain must be marked as primary"
		),
	facility_location: z.string().min(1).max(255),
	status: cycleStatusSchema.optional(),
	notes: z.string().max(2000).nullable().optional(),
});

export const updateGrowthCycleSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	start_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	end_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.nullable()
		.optional(),
	strains: z
		.array(strainInfoSchema)
		.min(1, "At least one strain required")
		.refine(
			(strains) => strains.some((strain) => strain.is_primary),
			"At least one strain must be marked as primary"
		)
		.optional(),
	facility_location: z.string().min(1).max(255).optional(),
	status: cycleStatusSchema.optional(),
	notes: z.string().max(2000).nullable().optional(),
});

export const growthCycleFiltersSchema = z.object({
	q: z.string().optional(),
	status: cycleStatusSchema.optional(),
	start_date_from: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	start_date_to: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/i, "Use YYYY-MM-DD format")
		.optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});
