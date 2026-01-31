import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket } from '../types';

const TICKETS_KEY = 'tickets.v1';

export const loadTickets = async (): Promise<Ticket[]> => {
  const raw = await AsyncStorage.getItem(TICKETS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Ticket[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveTickets = async (tickets: Ticket[]) => {
  await AsyncStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
};
