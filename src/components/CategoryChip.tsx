import React from 'react';
import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export const CategoryChip = ({ label, active, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    className={`mr-2 rounded-full px-4 py-2 ${
      active ? 'bg-brand-700' : 'bg-brand-100'
    }`}
  >
    <Text
      className={`text-xs font-semibold ${
        active ? 'text-white' : 'text-brand-700'
      }`}
    >
      {label}
    </Text>
  </Pressable>
);
