import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
	statusCode?: number;
	isOperational?: boolean;
}

export const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let error = { ...err };
	error.message = err.message;

	// Log error
	console.error("Error:", err);

	// Supabase errors
	if (err.message.includes("Invalid login credentials")) {
		error.message = "Invalid email or password";
		error.statusCode = 401;
	}

	if (err.message.includes("User not found")) {
		error.message = "User not found";
		error.statusCode = 404;
	}

	if (err.message.includes("Email not confirmed")) {
		error.message = "Please verify your email before logging in";
		error.statusCode = 401;
	}

	if (err.message.includes("User already registered")) {
		error.message = "User with this email already exists";
		error.statusCode = 409;
	}

	// JWT errors
	if (err.name === "JsonWebTokenError") {
		error.message = "Invalid token";
		error.statusCode = 401;
	}

	if (err.name === "TokenExpiredError") {
		error.message = "Token expired";
		error.statusCode = 401;
	}

	// Validation errors
	if (err.name === "ValidationError") {
		error.message = "Validation error";
		error.statusCode = 400;
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error",
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
