import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { fontFamily, radii, ThemeColors } from '@/constants/theme';

interface QtyStepperProps {
  qty: number;
  onInc: () => void;
  onDec: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function QtyStepper({ qty, onInc, onDec, size = 'md' }: QtyStepperProps) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const dims = SIZES[size];
  return (
    <View style={[styles.container, { paddingVertical: dims.padV, paddingHorizontal: dims.padH, borderRadius: dims.radius }]}>
      <Pressable onPress={onDec} hitSlop={8} style={{ width: dims.btnWidth, alignItems: 'center' }}>
        <Text style={[styles.symbol, { fontSize: dims.symbolSize }]}>–</Text>
      </Pressable>
      <Text style={[styles.qty, { fontSize: dims.qtySize }]}>{qty}</Text>
      <Pressable onPress={onInc} hitSlop={8} style={{ width: dims.btnWidth, alignItems: 'center' }}>
        <Text style={[styles.symbol, { fontSize: dims.symbolSize }]}>+</Text>
      </Pressable>
    </View>
  );
}

const SIZES = {
  sm: { padV: 4, padH: 8, radius: radii.sm, btnWidth: 16, symbolSize: 14, qtySize: 12 },
  md: { padV: 4, padH: 8, radius: radii.sm, btnWidth: 20, symbolSize: 15, qtySize: 12 },
  lg: { padV: 10, padH: 16, radius: radii.md, btnWidth: 26, symbolSize: 18, qtySize: 14 },
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surfaceAlt,
    },
    symbol: {
      fontFamily: fontFamily.bold,
      color: colors.text,
    },
    qty: {
      fontFamily: fontFamily.bold,
      color: colors.text,
    },
  });
