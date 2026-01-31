import React, { createContext, useContext, useMemo, useState } from 'react';
import { Ticket } from '../types';
import { fetchTicketsByUser, markTicketScanned } from '../services/tickets';
import {
  completeTransactionAndCreateTicket,
  createPendingTransaction,
} from '../services/transactions';
import { useAuth } from './AuthContext';

type TicketsContextValue = {
  tickets: Ticket[];
  isLoaded: boolean;
  createTicket: (input: {
    eventId: string;
    categoryId: string;
    amount: number;
    paymentMethod: 'orange_money' | 'mtn_momo';
  }) => Promise<void>;
  markUsed: (ticketId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const TicketsContext = createContext<TicketsContextValue | undefined>(
  undefined
);

export const TicketsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { session } = useAuth();

  const refresh = async () => {
    if (!session?.user?.id) {
      setTickets([]);
      setIsLoaded(true);
      return;
    }
    const stored = await fetchTicketsByUser(session.user.id);
    setTickets(stored);
    setIsLoaded(true);
  };

  React.useEffect(() => {
    refresh();
  }, [session?.user?.id]);

  const createTicket = async (input: {
    eventId: string;
    categoryId: string;
    amount: number;
    paymentMethod: 'orange_money' | 'mtn_momo';
  }) => {
    if (!session?.user?.id) return;
    const transactionId = await createPendingTransaction({
      userId: session.user.id,
      eventId: input.eventId,
      categoryId: input.categoryId,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
    });
    await completeTransactionAndCreateTicket({
      transactionId,
      userId: session.user.id,
      eventId: input.eventId,
      categoryId: input.categoryId,
    });
    await refresh();
  };

  const markUsed = async (ticketId: string) => {
    await markTicketScanned(ticketId);
    await refresh();
  };

  const value = useMemo(
    () => ({ tickets, isLoaded, createTicket, markUsed, refresh }),
    [tickets, isLoaded]
  );

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error('useTickets must be used within TicketsProvider');
  }
  return context;
};
