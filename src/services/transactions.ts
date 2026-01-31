import { supabase } from '../lib/supabase';
import { cyrb53, hashToBase36 } from '../utils/hash';

type CreateTicketInput = {
  userId: string;
  eventId: string;
  categoryId: string;
  amount: number;
  paymentMethod: 'orange_money' | 'mtn_momo';
};

export const createPendingTransaction = async ({
  userId,
  eventId,
  categoryId,
  amount,
  paymentMethod,
}: CreateTicketInput) => {
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      event_id: eventId,
      amount,
      status: 'pending',
      payment_method: paymentMethod,
      external_ref: `MM-${Date.now()}`,
    })
    .select('id')
    .single();

  if (transactionError || !transaction) {
    throw transactionError ?? new Error('Transaction introuvable');
  }

  return transaction.id;
};

export const completeTransactionAndCreateTicket = async ({
  transactionId,
  userId,
  eventId,
  categoryId,
}: {
  transactionId: string;
  userId: string;
  eventId: string;
  categoryId: string;
}) => {
  const { error: updateError } = await supabase
    .from('transactions')
    .update({ status: 'completed' })
    .eq('id', transactionId);

  if (updateError) {
    throw updateError;
  }

  const qrCodeHash = hashToBase36(
    cyrb53(`${userId}.${eventId}.${categoryId}.${Date.now()}`)
  );

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .insert({
      transaction_id: transactionId,
      user_id: userId,
      category_id: categoryId,
      qr_code_hash: qrCodeHash,
    })
    .select('id')
    .single();

  if (ticketError || !ticket) {
    throw ticketError ?? new Error('Ticket introuvable');
  }

  return {
    ticketId: ticket.id,
    qrCodeHash,
  };
};
