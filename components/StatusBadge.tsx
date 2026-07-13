import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamily, radii } from '@/constants/theme';

export function StatusBadge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 9.5,
  },
});
