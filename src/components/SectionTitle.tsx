import React from 'react';
import { Text, View } from 'react-native';

export const SectionTitle = ({ title }: { title: string }) => (
  <View className="mb-3 mt-6 flex-row items-center justify-between">
    <Text className="text-base font-semibold text-brand-900">{title}</Text>
  </View>
);
