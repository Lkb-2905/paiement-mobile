import { supabase } from '../lib/supabase';
import { Ticket } from '../types';

export const fetchTicketsByUser = async (userId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select(
      'id,created_at,is_scanned,scanned_at,qr_code_hash,ticket_categories(id,name,price,events(id,title,location,event_date,category))'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    eventId: row.ticket_categories?.events?.id ?? '',
    eventTitle: row.ticket_categories?.events?.title ?? 'Événement',
    category: row.ticket_categories?.name ?? 'Catégorie',
    price: Number(row.ticket_categories?.price ?? 0),
    purchasedAt: row.created_at ? new Date(row.created_at).getTime() : 0,
    usedAt: row.scanned_at ? new Date(row.scanned_at).getTime() : undefined,
    qrCodeHash: row.qr_code_hash,
  }));
};

export const fetchTicketById = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('tickets')
    .select(
      'id,is_scanned,scanned_at,qr_code_hash, ticket_categories(id,name,price,events(id,title))'
    )
    .eq('id', ticketId)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
};

export const fetchTicketByQrHash = async (qrCodeHash: string) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('id,is_scanned,scanned_at,qr_code_hash')
    .eq('qr_code_hash', qrCodeHash)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
};

export const markTicketScanned = async (ticketId: string) => {
  const { error } = await supabase
    .from('tickets')
    .update({ is_scanned: true, scanned_at: new Date().toISOString() })
    .eq('id', ticketId)
    .eq('is_scanned', false);

  if (error) {
    throw error;
  }
};
