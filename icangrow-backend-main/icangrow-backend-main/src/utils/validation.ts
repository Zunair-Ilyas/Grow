import { z } from "zod";

// Auth validation schemas
export const signupSchema = z
	.object({
		fullName: z
			.string()
			.min(2, "Full name must be at least 2 characters")
			.max(100, "Full name must be less than 100 characters")
			.regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
		email: z.string().email("Invalid email format").toLowerCase(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(128, "Password must be less than 128 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one lowercase letter, one uppercase letter, and one number"
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const loginSchema = z.object({
	email: z.string().email("Invalid email format").toLowerCase(),
	password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1, "Refresh token is required"),
});

export const verifyEmailSchema = z.object({
	token: z.string().min(1, "Verification token is required"),
	type: z.enum(["signup", "recovery", "email_change"]),
});

export const resendVerificationSchema = z.object({
	email: z.string().email("Invalid email format").toLowerCase(),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email format").toLowerCase(),
});

export const resetPasswordSchema = z
	.object({
		token: z.string().min(1, "Reset token is required"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(128, "Password must be less than 128 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one lowercase letter, one uppercase letter, and one number"
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(128, "Password must be less than 128 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one lowercase letter, one uppercase letter, and one number"
			),
		confirmNewPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords don't match",
		path: ["confirmNewPassword"],
	});

// Inventory validation schemas
export const inventoryLotsQuerySchema = z.object({
	searchTerm: z.string().optional(),
	facilityFilter: z.string().optional(),
	productTypeFilter: z.string().optional(),
	stageFilter: z.string().optional(),
	statusFilter: z.string().optional(),
});

export const stockAdjustmentSchema = z.object({
	quantity: z.number().refine((val) => val !== 0, {
		message: "Quantity cannot be zero",
	}),
	reason: z.string().min(1, "Reason is required").max(500, "Reason must be less than 500 characters"),
	unit_of_measure: z.string().optional(),
});

export const quarantineToggleSchema = z.object({
	action: z.enum(["quarantine", "release"]),
});

// Validation middleware
export const validate = (schema: z.ZodSchema, source: "body" | "query" | "params" = "body") => {
	return (req: any, res: any, next: any) => {
		try {
			const dataToValidate = source === "query" ? req.query : source === "params" ? req.params : req.body;
			schema.parse(dataToValidate);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({
					success: false,
					error: "Validation error",
					details: error.issues.map((err: z.ZodIssue) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				});
			}
			next(error);
		}
	};
};
