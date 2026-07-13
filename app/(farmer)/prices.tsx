import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { MarketPrice } from '@/types';

const TREND_ARROW: Record<MarketPrice['trend'], string> = { up: '↑', down: '↓', flat: '→' };

export default function PricesScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const trendColor: Record<MarketPrice['trend'], string> = {
    up: colors.greenDark,
    down: colors.red,
    flat: colors.textFaintest,
  };
  const [prices, setPrices] = useState<MarketPrice[]>([]);

  useEffect(() => {
    api.get<MarketPrice[]>('/market-prices').then(setPrices);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: TAB_BAR_CLEARANCE }}>
      <Text style={styles.title}>{t('todaysMarketPrices')}</Text>
      <Text style={styles.subtitle}>What buyers are paying right now — plan your next harvest.</Text>

      {prices.map((m) => (
        <View key={m.name} style={styles.row}>
          <Image source={{ uri: imageUrl(m.img) }} style={styles.image} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{m.name}</Text>
            <Text style={styles.price}>R{m.price.toFixed(2)}/kg</Text>
          </View>
          <Text style={[styles.trend, { color: trendColor[m.trend] }]}>
            {TREND_ARROW[m.trend]} {m.changePct}
          </Text>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  title: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.text, marginBottom: 6 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.textFaint, marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  image: { width: 58, height: 58, borderRadius: radii.lg, backgroundColor: colors.surfaceAlt },
  name: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
  price: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textFaint },
  trend: { fontFamily: fontFamily.bold, fontSize: 13 },
});
