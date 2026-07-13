import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { fontFamily, radii } from '@/constants/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'green' | 'dark' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({ title, onPress, variant = 'green', disabled, loading, style }: PrimaryButtonProps) {
  const { colors } = useTheme();
  const isOutline = variant === 'outline';
  const bg = disabled ? colors.border : variant === 'dark' ? colors.text : variant === 'green' ? colors.green : 'transparent';
  const textColor = isOutline ? colors.text : variant === 'dark' ? colors.bg : '#fff';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: bg },
        isOutline && { borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.text, { color: textColor }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fontFamily.bold,
    fontSize: 13.5,
  },
});
