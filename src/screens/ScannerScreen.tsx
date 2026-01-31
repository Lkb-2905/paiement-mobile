import React, { useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { PrimaryButton } from '../components/PrimaryButton';
import { isQrPayloadValid } from '../utils/qr';
import { fetchTicketByQrHash, markTicketScanned } from '../services/tickets';

export const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [message, setMessage] = useState('Prêt à scanner');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const isBusy = useRef(false);

  const handleScan = useCallback(
    async ({ data }: { data: string }) => {
      if (isBusy.current) return;
      isBusy.current = true;
      const payload = data.trim();
      const qrCodeHash = payload.split('.')[0];
      let ticket;
      try {
        ticket = await fetchTicketByQrHash(qrCodeHash);
      } catch {
        ticket = null;
      }

      if (!ticket) {
        setStatus('error');
        setMessage('Billet inconnu.');
      } else if (ticket.is_scanned) {
        setStatus('error');
        setMessage('Billet déjà scanné.');
      } else if (!isQrPayloadValid(payload, ticket.qr_code_hash)) {
        setStatus('error');
        setMessage('QR invalide ou expiré.');
      } else {
        try {
          await markTicketScanned(ticket.id);
        } catch {
          setStatus('error');
          setMessage('Erreur lors de la validation.');
          isBusy.current = false;
          return;
        }
        setStatus('success');
        setMessage('Entrée validée avec succès.');
      }

      setTimeout(() => {
        isBusy.current = false;
        setStatus('idle');
        setMessage('Prêt à scanner');
      }, 2000);
    },
    []
  );

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-100 px-6">
        <Text className="text-sm text-brand-700">
          Vérification des permissions caméra...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-100 px-6">
        <Text className="text-sm text-brand-700">
          Autorise l’accès caméra pour scanner les billets.
        </Text>
        <View className="mt-4">
          <PrimaryButton label="Autoriser" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brand-100">
      <CameraView
        className="flex-1"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleScan}
      />
      <View className="rounded-t-3xl bg-white px-6 py-6">
        <Text className="text-xs font-semibold text-brand-300">
          Scanner Admin
        </Text>
        <Text
          className={`mt-2 text-base font-semibold ${
            status === 'success'
              ? 'text-success'
              : status === 'error'
              ? 'text-danger'
              : 'text-brand-900'
          }`}
        >
          {message}
        </Text>
        <Text className="mt-2 text-xs text-brand-300">
          Fonctionne même avec une connexion instable.
        </Text>
      </View>
    </View>
  );
};
