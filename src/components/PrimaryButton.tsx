import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
};

export const PrimaryButton = ({
  label,
  onPress,
  disabled,
  variant = 'primary',
}: Props) => {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-2xl px-4 py-3 ${
        isGhost ? 'bg-brand-100' : 'bg-accent-500'
      } ${disabled ? 'opacity-50' : 'opacity-100'}`}
    >
      <View className="items-center">
        <Text
          className={`text-base font-semibold ${
            isGhost ? 'text-brand-700' : 'text-brand-900'
          }`}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};
