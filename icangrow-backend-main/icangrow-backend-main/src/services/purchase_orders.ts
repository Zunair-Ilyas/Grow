import { getSupabase } from "./supabase";

export class PurchaseOrdersService {
  private supabase;

  constructor() {
    this.supabase = getSupabase();
  }

  async getPurchaseOrders(filters: any = {}) {
    let query = this.supabase.from('purchase_orders').select('*');
    if (filters.searchTerm) {
      query = query.ilike('po_number', `%${filters.searchTerm}%`);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.supplier_id && filters.supplier_id !== 'all') {
      query = query.eq('supplier_id', filters.supplier_id);
    }
    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async getPurchaseOrderById(id: string) {
    const { data, error } = await this.supabase
      .from('purchase_orders')
      .select(`*, suppliers(name, email, phone, contact_person, address)`) // join supplier info
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getPurchaseOrderItems(po_id: string) {
    const { data, error } = await this.supabase
      .from('purchase_order_items')
      .select('*')
      .eq('po_id', po_id);
    if (error) throw new Error(error.message);
    return data;
  }

  async createPurchaseOrder(po: any, items: any[]) {
    // Insert PO
    const { data: poData, error: poError } = await this.supabase
      .from('purchase_orders')
      .insert(po)
      .select('*');
    if (poError) throw new Error(poError.message);
    const newPO = poData?.[0];
    // Insert items
    if (newPO && items && items.length > 0) {
      const itemsToInsert = items.map(item => ({ ...item, po_id: newPO.id }));
      const { error: itemsError } = await this.supabase
        .from('purchase_order_items')
        .insert(itemsToInsert);
      if (itemsError) throw new Error(itemsError.message);
    }
    return newPO;
  }

  async updatePurchaseOrder(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('purchase_orders')
      .update(updates)
      .eq('id', id)
      .select('*');
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async approvePurchaseOrder(id: string, approved_by: string) {
    const approval_date = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from('purchase_orders')
      .update({
        status: 'approved',
        approved_by,
        approval_date,
      })
      .eq('id', id)
      .select('*');
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async markDelivered(id: string) {
    const fulfilled_at = new Date().toISOString();
    const { data, error } = await this.supabase
      .from('purchase_orders')
      .update({
        status: 'delivered',
        fulfilled_at,
      })
      .eq('id', id)
      .select('*');
    if (error) throw new Error(error.message);
    return data?.[0];
  }
}

