import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTickets } from '../context/TicketsContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';
import { fetchEventById } from '../services/events';
import {
  completeTransactionAndCreateTicket,
  createPendingTransaction,
} from '../services/transactions';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen = ({ route, navigation }: Props) => {
  const { refresh } = useTickets();
  const { session } = useAuth();
  const [method, setMethod] = useState<'orange' | 'mtn'>('orange');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');
  const [event, setEvent] = useState<Awaited<
    ReturnType<typeof fetchEventById>
  > | null>(null);
  const [tierId, setTierId] = useState(route.params.tierId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchEventById(route.params.eventId);
        if (isMounted) {
          setEvent(data);
          if (data?.tiers.some((tier) => tier.id === tierId)) return;
          setTierId(data?.tiers[0]?.id ?? '');
        }
      } catch {
        if (isMounted) setError('Impossible de charger le paiement.');
      }
      if (isMounted) setLoading(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [route.params.eventId]);

  const tier = event?.tiers.find((item) => item.id === tierId);

  const price = tier?.price ?? 0;
  const orderId = useMemo(
    () => `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    []
  );

  const handlePurchase = async () => {
    if (!event || !tier) return;
    if (!session?.user?.id) return;
    setStatus('pending');
    try {
      const pendingId = await createPendingTransaction({
        userId: session.user.id,
        eventId: event.id,
        categoryId: tier.id,
        amount: tier.price,
        paymentMethod: method === 'orange' ? 'orange_money' : 'mtn_momo',
      });
      setTimeout(async () => {
        try {
          await completeTransactionAndCreateTicket({
            transactionId: pendingId,
            userId: session.user.id,
            eventId: event.id,
            categoryId: tier.id,
          });
          await refresh();
          setStatus('success');
        } catch (err) {
          setStatus('idle');
        }
      }, 1800);
    } catch {
      setStatus('idle');
      return;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-100 px-6">
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !event || !tier) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-100 px-6">
        <Text className="text-sm text-brand-700">
          {error || 'Paiement indisponible.'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brand-100 px-6 pt-6">
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-xs font-semibold text-brand-300">
          Commande {orderId}
        </Text>
        <Text className="mt-2 text-lg font-semibold text-brand-900">
          {event.title}
        </Text>
        <Text className="mt-1 text-sm text-brand-300">
          Catégorie: {tier.label}
        </Text>
        <Text className="mt-2 text-sm text-brand-700">
          Total: {price.toLocaleString('fr-FR')} FCFA
        </Text>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-base font-semibold text-brand-900">
          Mode de paiement
        </Text>
        <View className="mt-4 flex-row">
          <Text
            onPress={() => setMethod('orange')}
            className={`mr-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
              method === 'orange'
                ? 'bg-accent-500 text-brand-900'
                : 'bg-brand-100 text-brand-700'
            }`}
          >
            Orange Money
          </Text>
          <Text
            onPress={() => setMethod('mtn')}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              method === 'mtn'
                ? 'bg-accent-500 text-brand-900'
                : 'bg-brand-100 text-brand-700'
            }`}
          >
            MTN Money
          </Text>
        </View>
        <Text className="mt-3 text-xs text-brand-300">
          Simulation: traitement en 1-2 secondes.
        </Text>
      </View>

      <View className="mt-6">
        {status === 'pending' ? (
          <View className="items-center rounded-3xl bg-white p-6">
            <ActivityIndicator />
            <Text className="mt-3 text-sm text-brand-700">
              Paiement en cours...
            </Text>
          </View>
        ) : status === 'success' ? (
          <View className="rounded-3xl bg-white p-6">
            <Text className="text-base font-semibold text-success">
              Paiement confirmé !
            </Text>
            <Text className="mt-2 text-sm text-brand-700">
              Ton billet est disponible hors connexion.
            </Text>
            <View className="mt-4">
              <PrimaryButton
                label="Voir mon billet"
                onPress={() => navigation.navigate('Main')}
              />
            </View>
          </View>
        ) : (
          <PrimaryButton label="Payer maintenant" onPress={handlePurchase} />
        )}
      </View>
    </View>
  );
};
