import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

export const AuthScreen = () => {
  const { signInWithPhone, verifyOtp, isLoading } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSendOtp = async () => {
    setError('');
    if (!phone.startsWith('+237') || phone.length < 12) {
      setError('Entre un numéro valide au format +237.');
      return;
    }
    try {
      setBusy(true);
      await signInWithPhone(phone);
      setStep('otp');
    } catch (err) {
      setError("Impossible d'envoyer l'OTP. Vérifie Supabase.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    try {
      setBusy(true);
      await verifyOtp(phone, otp);
    } catch (err) {
      setError('Code OTP invalide ou expiré.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="flex-1 bg-brand-900 px-6 pt-16">
      <Text className="text-2xl font-semibold text-white">
        Billetterie & Fan Engagement
      </Text>
      <Text className="mt-2 text-sm text-brand-100">
        Connexion rapide avec Mobile Money, QR dynamique et mode offline.
      </Text>

      <View className="mt-10 rounded-3xl bg-white p-6">
        <Text className="text-base font-semibold text-brand-900">
          {step === 'phone' ? 'Ton numéro' : 'Code OTP'}
        </Text>
        <Text className="mt-2 text-xs text-brand-300">
          {step === 'phone'
            ? 'Format +237 6XX XXX XXX'
            : 'Code reçu par SMS'}
        </Text>
        {!isSupabaseConfigured ? (
          <Text className="mt-3 text-xs text-danger">
            Configure EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY.
          </Text>
        ) : null}
        <TextInput
          value={step === 'phone' ? phone : otp}
          onChangeText={step === 'phone' ? setPhone : setOtp}
          keyboardType="phone-pad"
          placeholder={step === 'phone' ? '+237 6XX XXX XXX' : '123456'}
          className="mt-4 rounded-2xl border border-brand-100 px-4 py-3 text-base text-brand-900"
        />
        {error ? (
          <Text className="mt-2 text-xs text-danger">{error}</Text>
        ) : null}
        <View className="mt-6">
          {busy || isLoading ? (
            <View className="items-center rounded-2xl bg-brand-100 py-3">
              <ActivityIndicator />
            </View>
          ) : (
            <PrimaryButton
              label={step === 'phone' ? 'Envoyer OTP' : 'Valider'}
              onPress={step === 'phone' ? handleSendOtp : handleVerify}
              disabled={!isSupabaseConfigured}
            />
          )}
        </View>
        {step === 'otp' ? (
          <View className="mt-4">
            <PrimaryButton
              label="Modifier le numéro"
              onPress={() => setStep('phone')}
              variant="ghost"
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};
