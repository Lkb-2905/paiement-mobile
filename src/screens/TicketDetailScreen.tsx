import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTickets } from '../context/TicketsContext';
import { buildQrPayload, secondsRemainingInSlot } from '../utils/qr';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketDetail'>;

export const TicketDetailScreen = ({ route }: Props) => {
  const { tickets } = useTickets();
  const ticket = tickets.find((item) => item.id === route.params.ticketId);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const qrPayload = useMemo(() => {
    if (!ticket?.qrCodeHash) return '';
    return buildQrPayload(ticket.qrCodeHash, now);
  }, [ticket, now]);

  if (!ticket) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-100 px-6">
        <Text className="text-sm text-brand-700">Billet introuvable.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brand-100 px-6 pt-10">
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-lg font-semibold text-brand-900">
          {ticket.eventTitle}
        </Text>
        <Text className="mt-1 text-xs text-brand-300">
          Catégorie: {ticket.category}
        </Text>
        <Text className="mt-1 text-xs text-brand-300">
          Prix: {ticket.price.toLocaleString('fr-FR')} FCFA
        </Text>

        <View className="mt-6 items-center">
          {ticket.qrCodeHash ? (
            <>
              <View className="rounded-3xl bg-brand-100 p-4">
                <QRCode value={qrPayload} size={190} />
              </View>
              <Text className="mt-3 text-xs text-brand-300">
                QR dynamique • Rafraîchissement dans{' '}
                {secondsRemainingInSlot(now)}s
              </Text>
            </>
          ) : (
            <Text className="text-xs text-danger">
              QR indisponible. Vérifie la synchronisation.
            </Text>
          )}
        </View>

        <View className="mt-6 rounded-2xl bg-brand-900 px-4 py-3">
          <Text className="text-xs font-semibold text-brand-100">
            Filigrane actif • Capture d’écran découragée
          </Text>
        </View>
      </View>
    </View>
  );
};
