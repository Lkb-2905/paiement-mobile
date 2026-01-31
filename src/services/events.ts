import { supabase } from '../lib/supabase';
import { Event } from '../types';

const formatEventDate = (value?: string | null) => {
  if (!value) return 'Date à confirmer';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date à confirmer';
  return date.toLocaleString('fr-FR', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const toHighlight = (category?: string | null) => {
  if (!category) return 'Paiement Mobile Money';
  if (category === 'sport') return 'Guichets express + accès offline';
  if (category === 'concert') return 'QR dynamique + anti-fraude';
  return 'Paiement ultra-rapide < 45s';
};

export const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(
      'id,title,description,location,event_date,category,image_url,ticket_categories(id,name,price)'
    )
    .order('event_date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category:
      row.category === 'sport'
        ? 'Sport'
        : row.category === 'concert'
        ? 'Art'
        : 'Divertissement',
    date: formatEventDate(row.event_date),
    location: row.location ?? 'Lieu à confirmer',
    description: row.description ?? '',
    tiers: (row.ticket_categories ?? []).map((tier) => ({
      id: tier.id,
      label: tier.name,
      price: Number(tier.price),
    })),
    highlight: toHighlight(row.category),
  }));
};

export const fetchEventById = async (eventId: string): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .select(
      'id,title,description,location,event_date,category,image_url,ticket_categories(id,name,price)'
    )
    .eq('id', eventId)
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    category:
      data.category === 'sport'
        ? 'Sport'
        : data.category === 'concert'
        ? 'Art'
        : 'Divertissement',
    date: formatEventDate(data.event_date),
    location: data.location ?? 'Lieu à confirmer',
    description: data.description ?? '',
    tiers: (data.ticket_categories ?? []).map((tier) => ({
      id: tier.id,
      label: tier.name,
      price: Number(tier.price),
    })),
    highlight: toHighlight(data.category),
  };
};
