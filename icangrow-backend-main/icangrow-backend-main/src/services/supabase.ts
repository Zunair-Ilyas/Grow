import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

let supabase: any = null;
let supabaseAdmin: any = null;

export const initializeSupabase = () => {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	console.log({ supabaseUrl, supabaseAnonKey, supabaseServiceKey });

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error("Missing Supabase environment variables");
	}

	// Client for user operations
	supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

	// Admin client for server-side operations
	if (supabaseServiceKey) {
		supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});
	}

	console.log("✅ Supabase initialized successfully");
};

export const getSupabase = () => {
	if (!supabase) {
		throw new Error("Supabase not initialized");
	}
	return supabase;
};

export const getSupabaseAdmin = () => {
	if (!supabaseAdmin) {
		throw new Error("Supabase admin client not initialized");
	}
	return supabaseAdmin;
};
