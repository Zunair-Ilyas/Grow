import jwt from "jsonwebtoken";
import { Request } from "express";

export interface JWTPayload {
	userId: string;
	email: string;
	role?: string;
	iat?: number;
	exp?: number;
}

export interface RefreshTokenPayload {
	userId: string;
	email: string;
	tokenVersion: number;
	iat?: number;
	exp?: number;
}

export const generateAccessToken = (
	payload: Omit<JWTPayload, "iat" | "exp">
): string => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not defined");
	}

	return jwt.sign(payload, secret, {
		expiresIn: process.env.JWT_EXPIRES_IN || "15m",
		issuer: "icangrow-api",
		audience: "icangrow-client",
	} as jwt.SignOptions);
};

export const generateRefreshToken = (
	payload: Omit<RefreshTokenPayload, "iat" | "exp">
): string => {
	const secret = process.env.JWT_REFRESH_SECRET;
	if (!secret) {
		throw new Error("JWT_REFRESH_SECRET is not defined");
	}

	return jwt.sign(payload, secret, {
		expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
		issuer: "icangrow-api",
		audience: "icangrow-client",
	} as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JWTPayload => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not defined");
	}

	try {
		return jwt.verify(token, secret, {
			issuer: "icangrow-api",
			audience: "icangrow-client",
		}) as JWTPayload;
	} catch (error) {
		throw new Error("Invalid or expired access token");
	}
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
	const secret = process.env.JWT_REFRESH_SECRET;
	if (!secret) {
		throw new Error("JWT_REFRESH_SECRET is not defined");
	}

	try {
		return jwt.verify(token, secret, {
			issuer: "icangrow-api",
			audience: "icangrow-client",
		}) as RefreshTokenPayload;
	} catch (error) {
		throw new Error("Invalid or expired refresh token");
	}
};

export const extractTokenFromHeader = (req: Request): string | null => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return null;
	}
	return authHeader.substring(7);
};

export const generateTokenPair = (
	userId: string,
	email: string,
	role?: string
) => {
	const accessToken = generateAccessToken({ userId, email, role });
	const refreshToken = generateRefreshToken({
		userId,
		email,
		tokenVersion: 1, // You can implement token versioning for security
	});

	return { accessToken, refreshToken };
};
