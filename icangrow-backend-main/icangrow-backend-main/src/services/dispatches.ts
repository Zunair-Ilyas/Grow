import { getSupabase } from './supabase';

export class DispatchesService {
  // List all dispatches with client info
  async getDispatches() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('dispatches')
      .select(`*, clients (name, company, license_number, status)`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Get details for a single dispatch
  async getDispatchDetail(id: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('dispatches')
      .select(`*, clients (name, company, license_number, status), dispatch_items (*, inventory_lots (lot_code, product_name, strain, coa_approved))`)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  // Create a new dispatch and its items
  async createDispatch(body: any, user: any) {
    const supabase = getSupabase();
    const { client_id, origin_facility, carrier, driver_name, vehicle_info, license_plate, notes, items } = body;
    if (!client_id || !items || items.length === 0) {
      throw new Error('Missing client or items');
    }
    // Insert dispatch
    const { data: dispatch, error: dispatchError } = await supabase
      .from('dispatches')
      .insert({
        client_id,
        origin_facility,
        carrier: carrier || null,
        driver_name: driver_name || null,
        vehicle_info: vehicle_info || null,
        license_plate: license_plate || null,
        notes: notes || null,
        created_by: user?.userId,
      })
      .select()
      .single();
    if (dispatchError) throw dispatchError;
    // Insert dispatch items
    const itemsToInsert = items.map((item: any) => ({
      dispatch_id: dispatch.id,
      lot_id: item.lot_id,
      quantity: item.quantity,
      unit_of_measure: 'units',
      available_at_selection: item.available_at_selection || 0,
    }));
    const { error: itemsError } = await supabase
      .from('dispatch_items')
      .insert(itemsToInsert);
    if (itemsError) throw itemsError;
    return dispatch;
  }

  // Confirm a dispatch
  async confirmDispatch(id: string, user: any) {
    const supabase = getSupabase();
    // Update dispatch status
    const { error: dispatchError } = await supabase
      .from('dispatches')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', id);
    if (dispatchError) throw dispatchError;
    // Get dispatch items
    const { data: dispatchDetail, error: detailError } = await supabase
      .from('dispatches')
      .select(`dispatch_items (*, inventory_lots (lot_code, product_name, strain, coa_approved)), clients (company)`)
      .eq('id', id)
      .single();
    if (detailError) throw detailError;
    const items = dispatchDetail?.dispatch_items || [];
    // Update stock levels and log movements
    for (const item of items) {
      // Update stock levels
      const { data: currentStock } = await supabase
        .from('stock_levels')
        .select('available_quantity')
        .eq('lot_id', item.lot_id)
        .single();
      if (currentStock) {
        await supabase
          .from('stock_levels')
          .update({
            available_quantity: Math.max(0, currentStock.available_quantity - item.quantity),
            reserved_quantity: item.quantity,
          })
          .eq('lot_id', item.lot_id);
      }
      // Log stock movement
      await supabase
        .from('stock_movements')
        .insert({
          lot_id: item.lot_id,
          movement_type: 'dispatch',
          quantity: item.quantity,
          unit_of_measure: item.unit_of_measure,
          reference_id: id,
          reference_type: 'dispatch',
          reason: `Dispatched to ${dispatchDetail?.clients?.company || 'Unknown Client'}`,
          performed_by: user?.userId,
        });
    }
    return true;
  }

  // Mark a dispatch as delivered
  async markDelivered(id: string) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('dispatches')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return true;
  }
}
