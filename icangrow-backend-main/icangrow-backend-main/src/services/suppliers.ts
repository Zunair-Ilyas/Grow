import { getSupabase } from "./supabase";

export class SuppliersService {
  private supabase;

  constructor() {
    this.supabase = getSupabase();
  }

  async getSuppliers(filters: any = {}) {
    let query = this.supabase.from('suppliers').select('*');
    if (filters.searchTerm) {
      query = query.or(
        `name.ilike.%${filters.searchTerm}%,` +
        `email.ilike.%${filters.searchTerm}%,` +
        `contact_person.ilike.%${filters.searchTerm}%`
      );
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.supplier_type && filters.supplier_type !== 'all') {
      query = query.eq('supplier_type', filters.supplier_type);
    }
    if (filters.approval_status && filters.approval_status !== 'all') {
      query = query.eq('approval_status', filters.approval_status);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async getSupplierById(id: string) {
    const { data, error } = await this.supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async createSupplier(supplier: any) {
    const { data, error } = await this.supabase
      .from('suppliers')
      .insert(supplier)
      .select('*');
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async updateSupplier(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select('*');
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async approveSupplier(id: string, status: 'approved' | 'rejected', approved_by: string) {
    const approval_date = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from('suppliers')
      .update({
        approval_status: status,
        approved_by,
        approval_date,
      })
      .eq('id', id)
      .select('*');
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  async archiveSupplier(id: string) {
    const { data, error } = await this.supabase
      .from('suppliers')
      .update({ approval_status: 'archived' })
      .eq('id', id)
      .select('*');
    if (error) throw new Error(error.message);
    return data?.[0];
  }
}

