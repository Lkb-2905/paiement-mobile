import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { CategoryChip } from '../components/CategoryChip';
import { EventCard } from '../components/EventCard';
import { SectionTitle } from '../components/SectionTitle';
import { EventCategory, RootStackParamList } from '../types';
import { useEvents } from '../hooks/useEvents';

const categories: (EventCategory | 'Tout')[] = [
  'Tout',
  'Sport',
  'Art',
  'Divertissement',
];

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [active, setActive] = useState<(typeof categories)[number]>('Tout');
  const { events, loading, error } = useEvents();

  const filtered = useMemo(
    () =>
      active === 'Tout'
        ? events
        : events.filter((event) => event.category === active),
    [active, events]
  );

  return (
    <ScrollView className="flex-1 bg-brand-100 px-6 pt-6">
      <View className="rounded-3xl bg-brand-700 px-5 py-6">
        <Text className="text-xs font-semibold text-brand-100">
          Douala • Yaoundé
        </Text>
        <Text className="mt-2 text-xl font-semibold text-white">
          Billets fiables, look premium, mode offline
        </Text>
        <Text className="mt-2 text-xs text-brand-100">
          Paiement Mobile Money en moins de 45 secondes.
        </Text>
      </View>

      <SectionTitle title="Catégories" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            active={active === category}
            onPress={() => setActive(category)}
          />
        ))}
      </ScrollView>

      <SectionTitle title="Événements à la une" />
      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Text className="text-sm text-danger">{error}</Text>
      ) : (
        filtered.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() =>
              navigation.navigate('EventDetails', { eventId: event.id })
            }
          />
        ))
      )}
    </ScrollView>
  );
};
