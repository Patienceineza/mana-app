import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { fontFamily, ThemeColors } from '@/constants/theme';

export function Wordmark() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.row}>
      <Image source={require('@/assets/icon.png')} style={styles.mark} resizeMode="contain" />
      <Text style={styles.name}>Mana</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    mark: { width: 34, height: 34, borderRadius: 8 },
    name: { fontFamily: fontFamily.extraBold, fontSize: 22, color: colors.text, letterSpacing: -0.3 },
  });
