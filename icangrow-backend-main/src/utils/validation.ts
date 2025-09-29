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

// Validation middleware for request body
export const validate = (schema: z.ZodSchema) => {
	return (req: any, res: any, next: any) => {
		try {
			schema.parse(req.body);
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

// Validation middleware for query parameters
export const validateQuery = (schema: z.ZodSchema) => {
	return (req: any, res: any, next: any) => {
		try {
			schema.parse(req.query);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({
					success: false,
					error: "Query validation failed",
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
