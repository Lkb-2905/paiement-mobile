import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export const AdminDashboardScreen = () => {
  const [stats, setStats] = useState({ sold: 0, used: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('tickets')
          .select('id,is_scanned');
        if (fetchError) throw fetchError;
        const sold = data?.length ?? 0;
        const used = (data ?? []).filter((ticket) => ticket.is_scanned).length;
        if (isMounted) {
          setStats({ sold, used, remaining: Math.max(0, sold - used) });
        }
      } catch (err) {
        if (isMounted) {
          setError('Impossible de charger les stats.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView className="flex-1 bg-brand-100 px-6 pt-6">
      <Text className="text-xl font-semibold text-brand-900">
        Dashboard Organisateur
      </Text>
      <Text className="mt-2 text-xs text-brand-300">
        Suivi des entrées en temps réel.
      </Text>

      {loading ? (
        <View className="mt-6 items-center">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Text className="mt-6 text-sm text-danger">{error}</Text>
      ) : (
        <>
          <View className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
            <Text className="text-sm font-semibold text-brand-700">
              Billets vendus
            </Text>
            <Text className="mt-2 text-2xl font-semibold text-brand-900">
              {stats.sold}
            </Text>
          </View>

          <View className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
            <Text className="text-sm font-semibold text-brand-700">
              Entrées validées
            </Text>
            <Text className="mt-2 text-2xl font-semibold text-success">
              {stats.used}
            </Text>
          </View>

          <View className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
            <Text className="text-sm font-semibold text-brand-700">
              Restants
            </Text>
            <Text className="mt-2 text-2xl font-semibold text-brand-900">
              {stats.remaining}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};
