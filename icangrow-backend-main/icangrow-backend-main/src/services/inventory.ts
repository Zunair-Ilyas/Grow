import { getSupabase, getSupabaseAdmin } from "./supabase";
import { Database } from "../types/database.types";

interface InventoryLotsFilters {
	searchTerm?: string;
	facilityFilter?: string;
	productTypeFilter?: string;
	stageFilter?: string;
	statusFilter?: string;
}

interface StockAdjustment {
	quantity: number;
	reason: string;
	unit_of_measure: string;
	performed_by: string;
}

export class InventoryService {
	private supabase;
	private supabaseAdmin;

	constructor() {
		this.supabase = getSupabase();
		this.supabaseAdmin = getSupabaseAdmin();
	}

	async getInventoryLots(filters: InventoryLotsFilters) {
		let query = this.supabase
			.from('inventory_lots')
			.select(`
				*,
				stock_levels(available_quantity, reserved_quantity),
				coa_records(lab_name, test_date, thc_percentage, cbd_percentage)
			`)
			.eq('stage', 'packaging'); // Only show packaging stage items

		// Apply filters
		if (filters.searchTerm) {
			query = query.or(
				`lot_code.ilike.%${filters.searchTerm}%,` +
				`product_name.ilike.%${filters.searchTerm}%,` +
				`strain.ilike.%${filters.searchTerm}%`
			);
		}

		if (filters.facilityFilter && filters.facilityFilter !== 'all') {
			query = query.eq('facility', filters.facilityFilter);
		}

		if (filters.productTypeFilter && filters.productTypeFilter !== 'all') {
			query = query.eq('product_type', filters.productTypeFilter);
		}

		if (filters.statusFilter && filters.statusFilter !== 'all') {
			query = query.eq('status', filters.statusFilter);
		}

		const { data, error } = await query.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch inventory lots: ${error.message}`);
		}

		return data;
	}

	async getLotDetails(lotId: string) {
		const { data, error } = await this.supabase
			.from('inventory_lots')
			.select(`
				*,
				stock_levels!inner(available_quantity, reserved_quantity),
				coa_records(lab_name, test_date, thc_percentage, cbd_percentage)
			`)
			.eq('id', lotId)
			.single();

		if (error) {
			throw new Error(`Failed to fetch lot details: ${error.message}`);
		}

		return data;
	}

	async getStockMovements(lotId: string) {
		const { data, error } = await this.supabase
			.from('stock_movements')
			.select('*')
			.eq('lot_id', lotId)
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch stock movements: ${error.message}`);
		}

		return data;
	}

	async getBatchInfo(batchId: string) {
		const { data, error } = await this.supabase
			.from('batches')
			.select('*')
			.eq('id', batchId)
			.single();

		if (error) {
			throw new Error(`Failed to fetch batch info: ${error.message}`);
		}

		return data;
	}

	async getBatchStages(batchId: string) {
		const { data, error } = await this.supabase
			.from('batch_stages')
			.select(`
				*,
				stages(name)
			`)
			.eq('batch_id', batchId)
			.order('created_at', { ascending: true });

		if (error) {
			throw new Error(`Failed to fetch batch stages: ${error.message}`);
		}

		// Transform data to include stage_name
		const transformedData = data?.map((stage: any) => ({
			...stage,
			stage_name: stage.stages?.name || 'Unknown'
		}));

		return transformedData;
	}

	async getDailyLogs(batchId: string, limit: number = 5) {
		const { data, error } = await this.supabase
			.from('daily_logs')
			.select('*')
			.eq('batch_id', batchId)
			.order('date', { ascending: false })
			.limit(limit);

		if (error) {
			throw new Error(`Failed to fetch daily logs: ${error.message}`);
		}

		return data;
	}

	async adjustStock(lotId: string, adjustment: StockAdjustment) {
		// Start a transaction-like operation
		const { data: lot, error: lotError } = await this.supabase
			.from('inventory_lots')
			.select('unit_of_measure')
			.eq('id', lotId)
			.single();

		if (lotError) {
			throw new Error(`Failed to find lot: ${lotError.message}`);
		}

		// Get current stock level
		const { data: stockLevel, error: stockError } = await this.supabase
			.from('stock_levels')
			.select('available_quantity')
			.eq('lot_id', lotId)
			.single();

		if (stockError) {
			throw new Error(`Failed to get stock level: ${stockError.message}`);
		}

		// Insert stock movement record
		const { error: movementError } = await this.supabaseAdmin
			.from('stock_movements')
			.insert({
				lot_id: lotId,
				movement_type: 'adjust',
				quantity: adjustment.quantity,
				unit_of_measure: adjustment.unit_of_measure || lot.unit_of_measure,
				reason: adjustment.reason,
				performed_by: adjustment.performed_by,
			});

		if (movementError) {
			throw new Error(`Failed to record stock movement: ${movementError.message}`);
		}

		// Update stock level
		const newQuantity = Math.max(0, stockLevel.available_quantity + adjustment.quantity);
		
		const { error: updateError } = await this.supabaseAdmin
			.from('stock_levels')
			.update({ available_quantity: newQuantity })
			.eq('lot_id', lotId);

		if (updateError) {
			throw new Error(`Failed to update stock level: ${updateError.message}`);
		}

		return { 
			success: true, 
			newQuantity,
			adjustment: adjustment.quantity 
		};
	}

	async toggleQuarantine(lotId: string, action: 'quarantine' | 'release', userId: string) {
		// Get current lot status
		const { data: lot, error: lotError } = await this.supabase
			.from('inventory_lots')
			.select('status')
			.eq('id', lotId)
			.single();

		if (lotError) {
			throw new Error(`Failed to find lot: ${lotError.message}`);
		}

		const newStatus = action === 'quarantine' ? 'quarantine' : 'available';
		
		// Update lot status
		const { error: updateError } = await this.supabaseAdmin
			.from('inventory_lots')
			.update({ status: newStatus })
			.eq('id', lotId);

		if (updateError) {
			throw new Error(`Failed to update lot status: ${updateError.message}`);
		}

		// Insert movement record
		const { error: movementError } = await this.supabaseAdmin
			.from('stock_movements')
			.insert({
				lot_id: lotId,
				movement_type: action,
				quantity: 0,
				unit_of_measure: 'units',
				reason: `${action === 'quarantine' ? 'Placed in' : 'Released from'} quarantine`,
				performed_by: userId,
			});

		if (movementError) {
			throw new Error(`Failed to record quarantine movement: ${movementError.message}`);
		}

		return { 
			success: true, 
			oldStatus: lot.status,
			newStatus: newStatus
		};
	}

	async getInventoryStats() {
		// Get total lots count
		const { count: totalLots, error: lotsError } = await this.supabase
			.from('inventory_lots')
			.select('*', { count: 'exact', head: true })
			.eq('stage', 'packaging');

		if (lotsError) {
			throw new Error(`Failed to get total lots: ${lotsError.message}`);
		}

		// Get dispatch ready count
		const { count: dispatchReady, error: dispatchError } = await this.supabase
			.from('inventory_lots')
			.select('*', { count: 'exact', head: true })
			.eq('stage', 'packaging')
			.eq('status', 'approved')
			.eq('coa_approved', true);

		if (dispatchError) {
			throw new Error(`Failed to get dispatch ready count: ${dispatchError.message}`);
		}

		// Get quarantine count
		const { count: quarantineCount, error: quarantineError } = await this.supabase
			.from('inventory_lots')
			.select('*', { count: 'exact', head: true })
			.eq('stage', 'packaging')
			.eq('status', 'quarantine');

		if (quarantineError) {
			throw new Error(`Failed to get quarantine count: ${quarantineError.message}`);
		}

		// Get expired count (this would need to be calculated based on expiry_date)
		const { count: expiredCount, error: expiredError } = await this.supabase
			.from('inventory_lots')
			.select('*', { count: 'exact', head: true })
			.eq('stage', 'packaging')
			.lt('expiry_date', new Date().toISOString());

		if (expiredError) {
			throw new Error(`Failed to get expired count: ${expiredError.message}`);
		}

		return {
			totalLots: totalLots || 0,
			dispatchReady: dispatchReady || 0,
			quarantined: quarantineCount || 0,
			expired: expiredCount || 0,
		};
	}

	async getAllBatches() {
		const { data, error } = await this.supabase
			.from('batches')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch batches: ${error.message}`);
		}

		return data;
	}
}