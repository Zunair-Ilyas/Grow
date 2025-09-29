import express from "express";
import { AuthService } from "../services/auth";
import { authenticate } from "../middleware/auth";
import {
	validate,
	signupSchema,
	loginSchema,
	refreshTokenSchema,
	verifyEmailSchema,
	resendVerificationSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	changePasswordSchema,
} from "../utils/validation";

const router: express.Router = express.Router();
const authService = new AuthService();

// @route   POST /api/v1/auth/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", validate(signupSchema), async (req, res, next) => {
	try {
		const { fullName, email, password } = req.body;

		const result = await authService.signup({
			fullName,
			email,
			password,
		});

		// Determine message based on the scenario
		let message =
			"User registered successfully. Please check your email to verify your account.";

		if (result.message === "verification_resent") {
			message =
				"User already exists but email is not verified. A new verification email has been sent to your email address.";
		}

		res.status(201).json({
			success: true,
			message,
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   POST /api/v1/auth/login
// @desc    Authenticate user and return tokens
// @access  Public
router.post("/login", validate(loginSchema), async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const result = await authService.login({
			email,
			password,
		});

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: result,
		});
	} catch (error) {
		next(error);
	}
});

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post(
	"/refresh",
	validate(refreshTokenSchema),
	async (req, res, next) => {
		try {
			const { refreshToken } = req.body;

			const tokens = await authService.refreshToken(refreshToken);

			res.status(200).json({
				success: true,
				message: "Token refreshed successfully",
				data: tokens,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   POST /api/v1/auth/verify-email
// @desc    Verify user email
// @access  Public
router.post(
	"/verify-email",
	validate(verifyEmailSchema),
	async (req, res, next) => {
		try {
			const { token, type } = req.body;

			const result = await authService.verifyEmail(token, type);

			res.status(200).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   POST /api/v1/auth/resend-verification
// @desc    Resend email verification
// @access  Public
router.post(
	"/resend-verification",
	validate(resendVerificationSchema),
	async (req, res, next) => {
		try {
			const { email } = req.body;

			const result = await authService.resendVerification(email);

			res.status(200).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   POST /api/v1/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
	"/forgot-password",
	validate(forgotPasswordSchema),
	async (req, res, next) => {
		try {
			const { email } = req.body;

			const result = await authService.forgotPassword(email);

			res.status(200).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post(
	"/reset-password",
	validate(resetPasswordSchema),
	async (req, res, next) => {
		try {
			const { token, password } = req.body;

			const result = await authService.resetPassword(token, password);

			res.status(200).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   POST /api/v1/auth/change-password
// @desc    Change user password
// @access  Private
router.post(
	"/change-password",
	authenticate,
	validate(changePasswordSchema),
	async (req, res, next) => {
		try {
			const { currentPassword, newPassword } = req.body;
			const userId = req.user!.userId;

			const result = await authService.changePassword(
				userId,
				currentPassword,
				newPassword
			);

			res.status(200).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}
);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", authenticate, async (req, res, next) => {
	try {
		const userId = req.user!.userId;

		const result = await authService.logout(userId);

		res.status(200).json({
			success: true,
			message: result.message,
		});
	} catch (error) {
		next(error);
	}
});

// @route   GET /api/v1/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", authenticate, async (req, res, next) => {
	try {
		const userId = req.user!.userId;

		const user = await authService.getCurrentUser(userId);

		res.status(200).json({
			success: true,
			data: { user },
		});
	} catch (error) {
		next(error);
	}
});

export default router;
