import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { RootStackParamList } from '../types';
import { fetchEventById } from '../services/events';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;

export const EventDetailsScreen = ({ route, navigation }: Props) => {
  const [event, setEvent] = useState<Awaited<
    ReturnType<typeof fetchEventById>
  > | null>(null);
  const [selectedTier, setSelectedTier] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchEventById(route.params.eventId);
        if (isMounted) {
          setEvent(data);
          setSelectedTier(data?.tiers[0]?.id ?? '');
        }
      } catch (err) {
        if (isMounted) {
          setError("Impossible de charger l'événement.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [route.params.eventId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-100 px-6">
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-100 px-6">
        <Text className="text-sm text-brand-700">
          {error || 'Événement introuvable.'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-brand-100 px-6 pt-6">
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-xs font-semibold text-brand-300">
          {event.category}
        </Text>
        <Text className="mt-2 text-xl font-semibold text-brand-900">
          {event.title}
        </Text>
        <Text className="mt-1 text-sm text-brand-300">{event.date}</Text>
        <Text className="mt-1 text-sm text-brand-300">{event.location}</Text>
        <Text className="mt-4 text-sm text-brand-700">
          {event.description}
        </Text>
      </View>

      <View className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-base font-semibold text-brand-900">
          Choisis ta catégorie
        </Text>
        <View className="mt-4">
          {event.tiers.map((tier) => (
            <Text
              key={tier.id}
              onPress={() => setSelectedTier(tier.id)}
              className={`mb-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                selectedTier === tier.id
                  ? 'bg-brand-700 text-white'
                  : 'bg-brand-100 text-brand-700'
              }`}
            >
              {tier.label} • {tier.price.toLocaleString('fr-FR')} FCFA
            </Text>
          ))}
        </View>
        <PrimaryButton
          label="Continuer vers paiement"
          onPress={() =>
            navigation.navigate('Checkout', {
              eventId: event.id,
              tierId: selectedTier,
            })
          }
        />
      </View>
    </ScrollView>
  );
};
