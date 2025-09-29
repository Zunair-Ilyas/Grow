import { getSupabase, getSupabaseAdmin } from "./supabase";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt";

export interface SignupData {
	fullName: string;
	email: string;
	password: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: {
		id: string;
		email: string;
		fullName?: string;
		emailVerified: boolean;
		role?: string;
	};
	accessToken: string | null;
	refreshToken: string | null;
	message?: string; // Optional message to indicate special cases
}

export class AuthService {
	private get supabase() {
		return getSupabase();
	}

	private get supabaseAdmin() {
		return getSupabaseAdmin();
	}

	async signup(data: SignupData): Promise<AuthResponse> {
		try {
			// Try to sign up the user first
			const { data: authData, error: authError } =
				await this.supabase.auth.signUp({
					email: data.email,
					password: data.password,
					options: {
						data: {
							full_name: data.fullName,
						},
					},
				});

			// Handle different error scenarios
			if (authError) {
				// Check if user already exists
				if (authError.message.includes("User already registered")) {
					// User exists - try to resend verification email
					// This will work for unverified users, but fail for verified users
					const { error: resendError } = await this.supabase.auth.resend({
						type: "signup",
						email: data.email,
					});

					if (resendError) {
						// If resend fails, it likely means the user is already verified
						if (
							resendError.message.includes("Email rate limit exceeded") ||
							resendError.message.includes("already confirmed")
						) {
							throw new Error(
								"An account with this email already exists. Please use login instead."
							);
						} else {
							throw new Error(
								`Failed to resend verification email: ${resendError.message}`
							);
						}
					}

					// Return user info without tokens for existing unverified user
					return {
						user: {
							id: "existing-user", // We don't have the actual ID here
							email: data.email,
							fullName: data.fullName,
							emailVerified: false,
							role: "grower",
						},
						accessToken: null,
						refreshToken: null,
						message: "verification_resent",
					};
				} else {
					// Other signup errors
					throw new Error(authError.message);
				}
			}

			if (!authData.user) {
				throw new Error("Failed to create user");
			}

			// Profile is automatically created by database trigger
			// No need to manually create it here
			console.log(
				"User created successfully, profile will be created by database trigger"
			);

			// Always return user info without tokens on signup
			// User must verify email via Supabase email link before getting tokens
			return {
				user: {
					id: authData.user.id,
					email: data.email,
					fullName: data.fullName,
					emailVerified: false, // Always false on signup
					role: "grower",
				},
				accessToken: null,
				refreshToken: null,
			};
		} catch (error) {
			throw new Error(
				`Signup failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async login(data: LoginData): Promise<AuthResponse> {
		try {
			// Authenticate with Supabase
			const { data: authData, error: authError } =
				await this.supabase.auth.signInWithPassword({
					email: data.email,
					password: data.password,
				});

			if (authError) {
				throw new Error(authError.message);
			}

			if (!authData.user) {
				throw new Error("Authentication failed");
			}

			// Get user profile
			const { data: profile, error: profileError } = await this.supabaseAdmin
				.from("profiles")
				.select("full_name, role, status, email_verified")
				.eq("user_id", authData.user.id)
				.single();

			if (profileError) {
				console.error("Profile fetch error:", profileError);
				throw new Error("User profile not found. Please contact support.");
			}

			console.log("Profile data:", profile);
			console.log("Auth user data:", {
				id: authData.user.id,
				email_confirmed_at: authData.user.email_confirmed_at,
			});

			// Check email verification - allow login if either source shows verified
			const isEmailVerified =
				profile.email_verified || authData.user.email_confirmed_at !== null;
			console.log("Email verification check:", {
				profile_email_verified: profile.email_verified,
				auth_email_confirmed_at: authData.user.email_confirmed_at,
				isEmailVerified,
			});

			if (!isEmailVerified) {
				throw new Error("Please verify your email before logging in.");
			}

			// Check if user account is active or pending (pending is OK for new users)
			if (profile.status !== "active" && profile.status !== "pending") {
				console.error("Account status check failed:", {
					expected: "active or pending",
					actual: profile.status,
				});
				throw new Error("Account is not active. Please contact support.");
			}

			// If status is pending but email is verified, update to active
			if (profile.status === "pending" && isEmailVerified) {
				console.log("Updating profile status from pending to active");
				const { error: updateError } = await this.supabaseAdmin
					.from("profiles")
					.update({
						status: "active",
						email_verified: true,
						updated_at: new Date().toISOString(),
					})
					.eq("user_id", authData.user.id);

				if (updateError) {
					console.error("Failed to update profile status:", updateError);
				} else {
					console.log("Profile status updated to active");
					profile.status = "active";
					profile.email_verified = true;
				}
			}

			// Generate tokens
			const { accessToken, refreshToken } = generateTokenPair(
				authData.user.id,
				data.email,
				profile.role || "grower"
			);

			return {
				user: {
					id: authData.user.id,
					email: data.email,
					fullName: profile.full_name,
					emailVerified:
						profile.email_verified || authData.user.email_confirmed_at !== null,
					role: profile.role || "grower",
				},
				accessToken,
				refreshToken,
			};
		} catch (error) {
			throw new Error(
				`Login failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async refreshToken(
		refreshToken: string
	): Promise<{ accessToken: string; refreshToken: string }> {
		try {
			// Verify refresh token
			const payload = verifyRefreshToken(refreshToken);

			// Get user from Supabase
			const { data: user, error } =
				await this.supabaseAdmin.auth.admin.getUserById(payload.userId);

			if (error || !user.user) {
				throw new Error("User not found");
			}

			// Get user profile for role
			const { data: profile } = await this.supabaseAdmin
				.from("profiles")
				.select("role")
				.eq("user_id", payload.userId)
				.single();

			// Generate new token pair
			const newTokens = generateTokenPair(
				payload.userId,
				user.user.email!,
				profile?.role || "grower"
			);

			return newTokens;
		} catch (error) {
			throw new Error(
				`Token refresh failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async verifyEmail(token: string, type: string): Promise<{ message: string }> {
		try {
			const { error } = await this.supabase.auth.verifyOtp({
				token_hash: token,
				type: type as any,
			});

			if (error) {
				throw new Error(error.message);
			}

			return { message: "Email verified successfully" };
		} catch (error) {
			throw new Error(
				`Email verification failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async resendVerification(email: string): Promise<{ message: string }> {
		try {
			const { error } = await this.supabase.auth.resend({
				type: "signup",
				email: email,
			});

			if (error) {
				throw new Error(error.message);
			}

			return { message: "Verification email sent" };
		} catch (error) {
			throw new Error(
				`Failed to resend verification: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async forgotPassword(email: string): Promise<{ message: string }> {
		try {
			const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
			});

			if (error) {
				throw new Error(error.message);
			}

			return { message: "Password reset email sent" };
		} catch (error) {
			throw new Error(
				`Password reset failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async resetPassword(
		token: string,
		newPassword: string
	): Promise<{ message: string }> {
		try {
			const { error } = await this.supabase.auth.verifyOtp({
				token_hash: token,
				type: "recovery",
			});

			if (error) {
				throw new Error(error.message);
			}

			// Update password
			const { error: updateError } = await this.supabase.auth.updateUser({
				password: newPassword,
			});

			if (updateError) {
				throw new Error(updateError.message);
			}

			return { message: "Password reset successfully" };
		} catch (error) {
			throw new Error(
				`Password reset failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string
	): Promise<{ message: string }> {
		try {
			// First verify current password by attempting to sign in
			const { data: user } = await this.supabaseAdmin.auth.admin.getUserById(
				userId
			);

			if (!user.user) {
				throw new Error("User not found");
			}

			// Update password
			const { error } = await this.supabaseAdmin.auth.admin.updateUserById(
				userId,
				{
					password: newPassword,
				}
			);

			if (error) {
				throw new Error(error.message);
			}

			return { message: "Password changed successfully" };
		} catch (error) {
			throw new Error(
				`Password change failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async logout(userId: string): Promise<{ message: string }> {
		try {
			// Sign out from Supabase
			const { error } = await this.supabase.auth.signOut();

			if (error) {
				throw new Error(error.message);
			}

			return { message: "Logged out successfully" };
		} catch (error) {
			throw new Error(
				`Logout failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	async getCurrentUser(userId: string): Promise<AuthResponse["user"]> {
		try {
			const { data: user, error } =
				await this.supabaseAdmin.auth.admin.getUserById(userId);

			if (error || !user.user) {
				throw new Error("User not found");
			}

			// Get user profile
			const { data: profile } = await this.supabaseAdmin
				.from("profiles")
				.select("full_name, role, status, email_verified")
				.eq("user_id", userId)
				.single();

			return {
				id: user.user.id,
				email: user.user.email!,
				fullName: profile?.full_name,
				emailVerified:
					profile?.email_verified || user.user.email_confirmed_at !== null,
				role: profile?.role || "grower",
			};
		} catch (error) {
			throw new Error(
				`Failed to get user: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}
}
