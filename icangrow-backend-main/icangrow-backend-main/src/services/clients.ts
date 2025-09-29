import { getSupabase } from "./supabase";

export class ClientsService {
  private get supabase() {
    return getSupabase();
  }

  async getClients({ search, status, type }: { search?: string; status?: string; type?: string }) {
    let query = this.supabase.from('clients').select();
    console.log(query)

    // if (status && status !== 'all') {
    //   query = query.eq('status', status);
    // }
    // if (type && type !== 'all') {
    //   query = query.eq('client_type', type);
    // }
    // if (search) {
    //   // Supabase doesn't support full-text search on all columns, so use ilike for relevant fields
    //   query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,license_number.ilike.%${search}%`);
    // }
    // query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    console.log(data)
    if (error) throw error;
    return data;
  }

  async deleteClient(id: string) {
    const { error } = await this.supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  async archiveClient(id: string) {
    const { error } = await this.supabase.from('clients').update({ status: 'archived' }).eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  async createClient(clientData: any) {
    const { data, error } = await this.supabase.from('clients').insert([clientData]).select('*').single();
    if (error) throw error;
    return data;
  }

  async updateClient(id: string, clientData: any) {
    const { data, error } = await this.supabase.from('clients').update(clientData).eq('id', id).select('*').single();
    if (error) throw error;
    return data;
  }
}
