import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ticket } from '../types';

type Props = {
  ticket: Ticket;
  onPress: () => void;
};

export const TicketCard = ({ ticket, onPress }: Props) => {
  const used = Boolean(ticket.usedAt);
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-3xl bg-white px-4 py-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-brand-900">
          {ticket.eventTitle}
        </Text>
        <View
          className={`rounded-full px-3 py-1 ${
            used ? 'bg-danger/10' : 'bg-success/10'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              used ? 'text-danger' : 'text-success'
            }`}
          >
            {used ? 'Déjà scanné' : 'Valide'}
          </Text>
        </View>
      </View>
      <Text className="mt-2 text-xs text-brand-300">
        Catégorie: {ticket.category}
      </Text>
      <Text className="mt-1 text-xs text-brand-300">
        Prix: {ticket.price.toLocaleString('fr-FR')} FCFA
      </Text>
      <View className="mt-4 rounded-2xl bg-brand-700 px-3 py-2">
        <Text className="text-xs font-semibold text-white">
          Afficher le billet
        </Text>
      </View>
    </Pressable>
  );
};
