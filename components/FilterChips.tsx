import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';

interface FilterChipsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

// Horizontal scrolling chip row for a single-select filter (status, stock
// state, etc.) — reused across the marketplace, listings, inspections, and
// both delivery screens instead of building this five times.
export function FilterChips<T extends string>({ options, value, onChange }: FilterChipsProps<T>) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.chip, { borderColor: active ? colors.greenDark : colors.border, backgroundColor: active ? colors.greenDark : colors.surfaceMuted }]}
          >
            <Text style={[styles.chipText, { color: active ? '#fff' : colors.text }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: { gap: 8, paddingVertical: 2 },
    chip: { borderWidth: 1.5, borderRadius: radii.pill, paddingVertical: 7, paddingHorizontal: spacing.md },
    chipText: { fontFamily: fontFamily.bold, fontSize: 12 },
  });
