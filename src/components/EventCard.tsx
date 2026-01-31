import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Event } from '../types';

type Props = {
  event: Event;
  onPress: () => void;
};

export const EventCard = ({ event, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    className="mb-4 rounded-3xl bg-white px-4 py-4 shadow-sm"
  >
    <View className="mb-2 flex-row items-center justify-between">
      <Text className="text-xs font-semibold text-brand-300">
        {event.category}
      </Text>
      <View className="rounded-full bg-brand-100 px-3 py-1">
        <Text className="text-xs font-semibold text-brand-700">
          {event.highlight}
        </Text>
      </View>
    </View>
    <Text className="text-lg font-semibold text-brand-900">
      {event.title}
    </Text>
    <Text className="mt-1 text-sm text-brand-300">{event.date}</Text>
    <Text className="mt-1 text-sm text-brand-300">{event.location}</Text>
    <View className="mt-4 rounded-2xl bg-brand-700 px-3 py-2">
      <Text className="text-xs font-semibold text-white">
        Acheter en Mobile Money
      </Text>
    </View>
  </Pressable>
);
