import { Request, Response, NextFunction } from "express";
import {
	verifyAccessToken,
	extractTokenFromHeader,
	JWTPayload,
} from "../utils/jwt";
import { getSupabase, getSupabaseAdmin } from "../services/supabase";

// Extend Request interface to include user
declare global {
	namespace Express {
		interface Request {
			user?: JWTPayload;
		}
	}
}

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = extractTokenFromHeader(req);

		if (!token) {
			res.status(401).json({
				success: false,
				error: "Access token required",
			});
			return;
		}

		// Verify JWT token
		const payload = verifyAccessToken(token);
		console.log("JWT payload:", payload);

		// Verify user still exists in profiles table
		const supabaseAdmin = getSupabaseAdmin();
		const { data: profile, error: profileError } = await supabaseAdmin
			.from("profiles")
			.select("status, email_verified")
			.eq("user_id", payload.userId)
			.single();

		console.log("Profile check:", { profile, profileError });

		if (profileError || !profile) {
			res.status(401).json({
				success: false,
				error: "User profile not found",
			});
			return;
		}

		// Check if user account is still active
		if (profile.status !== "active") {
			res.status(401).json({
				success: false,
				error: "Account is not active",
			});
			return;
		}

		// Add user info to request
		req.user = {
			userId: payload.userId,
			email: payload.email,
			role: payload.role,
		};

		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			error: "Invalid or expired token",
		});
	}
};

export const optionalAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = extractTokenFromHeader(req);

		if (token) {
			const payload = verifyAccessToken(token);
			const supabase = getSupabase();
			const { data: user } = await supabase.auth.getUser(token);

			if (user.user) {
				req.user = {
					userId: user.user.id,
					email: user.user.email!,
					role: payload.role,
				};
			}
		}

		next();
	} catch (error) {
		// Continue without authentication for optional auth
		next();
	}
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: "Authentication required",
			});
			return;
		}

		if (!req.user.role || !allowedRoles.includes(req.user.role)) {
			res.status(403).json({
				success: false,
				error: "Insufficient permissions",
			});
			return;
		}

		next();
	};
};

// Admin only middleware
export const requireAdmin = requireRole(["admin"]);

// Check if user can access specific resource
export const requireOwnershipOrAdmin = (
	resourceUserIdField: string = "user_id"
) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: "Authentication required",
			});
			return;
		}

		// Admin can access everything
		if (req.user.role === "admin") {
			next();
			return;
		}

		// Check if user owns the resource
		const resourceUserId =
			req.params[resourceUserIdField] || req.body[resourceUserIdField];

		if (resourceUserId !== req.user.userId) {
			res.status(403).json({
				success: false,
				error: "Access denied",
			});
			return;
		}

		next();
	};
};
