import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TicketCard } from '../components/TicketCard';
import { useTickets } from '../context/TicketsContext';
import { RootStackParamList } from '../types';

export const TicketsScreen = () => {
  const { tickets, isLoaded } = useTickets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView className="flex-1 bg-brand-100 px-6 pt-6">
      <Text className="text-xl font-semibold text-brand-900">
        Wallet Billets
      </Text>
      <Text className="mt-2 text-xs text-brand-300">
        Accès offline garanti même sans connexion.
      </Text>

      <View className="mt-6">
        {!isLoaded ? (
          <Text className="text-sm text-brand-300">Chargement...</Text>
        ) : tickets.length === 0 ? (
          <View className="rounded-3xl bg-white p-6">
            <Text className="text-sm text-brand-700">
              Aucun billet pour l’instant.
            </Text>
            <Text className="mt-2 text-xs text-brand-300">
              Achète un événement depuis l’accueil.
            </Text>
          </View>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPress={() =>
                navigation.navigate('TicketDetail', { ticketId: ticket.id })
              }
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};
