import { getSupabaseAdmin } from "@/services/supabase";
import { Database } from "@/types/database.types";

type EnvironmentalMonitoring =
	Database["public"]["Tables"]["environmental_monitoring"]["Row"];

export interface EnvironmentalFilters {
	batch_id?: string;
	room_name?: string;
	status?: string;
	date_from?: string;
	date_to?: string;
	page?: number;
	limit?: number;
}

export interface EnvironmentalListResponse {
	environmental_readings: EnvironmentalMonitoring[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export class QMSEnvironmentalService {
	private get supabase() {
		return getSupabaseAdmin();
	}

	/**
	 * List environmental monitoring readings with optional filters
	 */
	async listEnvironmentalReadings(
		filters: EnvironmentalFilters = {}
	): Promise<EnvironmentalListResponse> {
		try {
			const {
				batch_id,
				room_name,
				status,
				date_from,
				date_to,
				page = 1,
				limit = 20,
			} = filters;

			let query = this.supabase.from("environmental_monitoring").select(
				`
					*,
					batch:batches(name, strain),
					recorded_by_profile:profiles!environmental_monitoring_recorded_by_fkey(full_name, role)
				`,
				{ count: "exact" }
			);

			// Apply filters
			if (batch_id) {
				query = query.eq("batch_id", batch_id);
			}
			if (room_name) {
				query = query.ilike("room_name", `%${room_name}%`);
			}
			if (status) {
				query = query.eq("status", status);
			}
			if (date_from) {
				query = query.gte("recorded_at", date_from);
			}
			if (date_to) {
				query = query.lte("recorded_at", date_to);
			}

			// Apply pagination
			const from = (page - 1) * limit;
			const to = from + limit - 1;
			query = query.range(from, to);

			// Order by recorded_at (newest first)
			query = query.order("recorded_at", { ascending: false });

			const { data: environmental_readings, error, count } = await query;

			if (error) {
				throw new Error(
					`Failed to fetch environmental readings: ${error.message}`
				);
			}

			const total = count || 0;
			const totalPages = Math.ceil(total / limit);

			return {
				environmental_readings: environmental_readings || [],
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			throw new Error(
				`Failed to list environmental readings: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get environmental readings for a specific batch
	 */
	async getEnvironmentalReadingsByBatch(
		batchId: string
	): Promise<EnvironmentalMonitoring[]> {
		try {
			const { data: readings, error } = await this.supabase
				.from("environmental_monitoring")
				.select(
					`
					*,
					recorded_by_profile:profiles!environmental_monitoring_recorded_by_fkey(full_name, role)
				`
				)
				.eq("batch_id", batchId)
				.order("recorded_at", { ascending: false });

			if (error) {
				throw new Error(
					`Failed to fetch batch environmental readings: ${error.message}`
				);
			}

			return readings || [];
		} catch (error) {
			throw new Error(
				`Failed to get batch environmental readings: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get environmental readings for a specific room
	 */
	async getEnvironmentalReadingsByRoom(
		roomName: string
	): Promise<EnvironmentalMonitoring[]> {
		try {
			const { data: readings, error } = await this.supabase
				.from("environmental_monitoring")
				.select(
					`
					*,
					batch:batches(name, strain),
					recorded_by_profile:profiles!environmental_monitoring_recorded_by_fkey(full_name, role)
				`
				)
				.ilike("room_name", `%${roomName}%`)
				.order("recorded_at", { ascending: false });

			if (error) {
				throw new Error(
					`Failed to fetch room environmental readings: ${error.message}`
				);
			}

			return readings || [];
		} catch (error) {
			throw new Error(
				`Failed to get room environmental readings: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	/**
	 * Get environmental readings summary for a date range
	 */
	async getEnvironmentalSummary(
		dateFrom: string,
		dateTo: string,
		roomName?: string
	): Promise<{
		average_temperature: number | null;
		average_humidity: number | null;
		average_co2: number | null;
		average_ph: number | null;
		total_readings: number;
		alerts_count: number;
	}> {
		try {
			let query = this.supabase
				.from("environmental_monitoring")
				.select("temperature, humidity, co2_level, ph_level, status")
				.gte("recorded_at", dateFrom)
				.lte("recorded_at", dateTo);

			if (roomName) {
				query = query.ilike("room_name", `%${roomName}%`);
			}

			const { data: readings, error } = await query;

			if (error) {
				throw new Error(
					`Failed to fetch environmental summary: ${error.message}`
				);
			}

			if (!readings || readings.length === 0) {
				return {
					average_temperature: null,
					average_humidity: null,
					average_co2: null,
					average_ph: null,
					total_readings: 0,
					alerts_count: 0,
				};
			}

			// Calculate averages
			const validTemps = readings
				.filter((r: any) => r.temperature !== null)
				.map((r: any) => r.temperature!);
			const validHumidity = readings
				.filter((r: any) => r.humidity !== null)
				.map((r: any) => r.humidity!);
			const validCO2 = readings
				.filter((r: any) => r.co2_level !== null)
				.map((r: any) => r.co2_level!);
			const validPH = readings
				.filter((r: any) => r.ph_level !== null)
				.map((r: any) => r.ph_level!);

			const average_temperature =
				validTemps.length > 0
					? validTemps.reduce((sum: number, temp: number) => sum + temp, 0) /
					  validTemps.length
					: null;
			const average_humidity =
				validHumidity.length > 0
					? validHumidity.reduce((sum: number, hum: number) => sum + hum, 0) /
					  validHumidity.length
					: null;
			const average_co2 =
				validCO2.length > 0
					? validCO2.reduce((sum: number, co2: number) => sum + co2, 0) /
					  validCO2.length
					: null;
			const average_ph =
				validPH.length > 0
					? validPH.reduce((sum: number, ph: number) => sum + ph, 0) /
					  validPH.length
					: null;

			const alerts_count = readings.filter(
				(r: any) => r.status === "alert" || r.status === "warning"
			).length;

			return {
				average_temperature: average_temperature
					? Math.round(average_temperature * 100) / 100
					: null,
				average_humidity: average_humidity
					? Math.round(average_humidity * 100) / 100
					: null,
				average_co2: average_co2 ? Math.round(average_co2 * 100) / 100 : null,
				average_ph: average_ph ? Math.round(average_ph * 100) / 100 : null,
				total_readings: readings.length,
				alerts_count,
			};
		} catch (error) {
			throw new Error(
				`Failed to get environmental summary: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}
}
