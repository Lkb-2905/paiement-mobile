export type EventCategory = 'Sport' | 'Art' | 'Divertissement';

export type TicketTier = {
  id: string;
  label: string;
  price: number;
};

export type Event = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  description: string;
  tiers: TicketTier[];
  highlight: string;
};

export type Ticket = {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  price: number;
  purchasedAt: number;
  usedAt?: number;
  qrCodeHash?: string;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  EventDetails: { eventId: string };
  Checkout: { eventId: string; tierId: string };
  TicketDetail: { ticketId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Tickets: undefined;
  Scanner: undefined;
  Admin: undefined;
};
