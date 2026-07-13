import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, ApiError, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { RouteToday } from '@/types';

export default function CoordinatorRouteScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [route, setRoute] = useState<RouteToday | null>(null);

  useEffect(() => {
    api.get<RouteToday>('/routes/today').then(setRoute).catch((err) => {
      if (!(err instanceof ApiError && err.status === 404)) throw err;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
      <View style={styles.hero}>
        <Image source={{ uri: imageUrl('/static/images/farmrows.jpg') }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroText}>{route?.name ?? 'Rural cluster → urban hub route'}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>{t('dropOffSequence')}</Text>
      {(route?.stops.length ?? 0) === 0 && <Text style={styles.empty}>{t('noRouteToday')}</Text>}
      {route?.stops.map((stop) => (
        <View key={stop.seq} style={styles.row}>
          <View style={styles.seqBadge}>
            <Text style={styles.seqText}>{stop.seq}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stopName}>{stop.name}</Text>
            <Text style={styles.stopMeta}>{stop.farmsCount} farms</Text>
          </View>
          <Text style={styles.dispatch}>{stop.dispatchTime}</Text>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  hero: { height: 130, borderRadius: radii.lg, overflow: 'hidden', marginBottom: spacing.lg },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', padding: 12, backgroundColor: 'rgba(20,22,26,0.35)' },
  heroText: { color: '#fff', fontFamily: fontFamily.semiBold, fontSize: 12 },
  sectionLabel: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.coordMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.coordBorder },
  seqBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  seqText: { fontFamily: fontFamily.bold, fontSize: 12, color: '#fff' },
  stopName: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.text },
  stopMeta: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.coordMuted },
  dispatch: { fontFamily: fontFamily.semiBold, fontSize: 12, color: colors.coordMuted },
  empty: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.coordMuted },
});
