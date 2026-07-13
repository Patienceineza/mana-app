import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { QcInspection } from '@/types';

export default function CoordinatorOverviewScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [inspections, setInspections] = useState<QcInspection[]>([]);

  const load = useCallback(async () => {
    const res = await api.get<QcInspection[]>('/qc/inspections');
    setInspections(res);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const pending = inspections.filter((i) => i.status === 'pending').length;
  const passed = inspections.filter((i) => i.status === 'passed').length;
  const rejected = inspections.filter((i) => i.status === 'rejected').length;
  const totalWeight = inspections.reduce((sum, i) => sum + i.expectedWeight, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
      <View style={styles.hero}>
        <Image source={{ uri: imageUrl('/static/images/warehouse.jpg') }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroText}>{t('todaysFieldOperations')}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <StatCard styles={styles} value={pending} label={t('pendingInspections')} color={colors.text} />
        <StatCard styles={styles} value={passed} label={t('passedToday')} color="#4CC58A" />
        <StatCard styles={styles} value={rejected} label={t('rejectedToday')} color="#E05A5A" />
        <StatCard styles={styles} value={`${totalWeight} kg`} label={t('totalWeightQueued')} color={colors.green} />
      </View>

      <Pressable style={styles.primaryButton} onPress={() => router.push('/(coordinator)/inspections')}>
        <Text style={styles.primaryButtonText}>{t('goToInspections')}</Text>
      </Pressable>
      <Pressable style={styles.outlineButton} onPress={() => router.push('/(coordinator)/route')}>
        <Text style={styles.outlineButtonText}>{t('viewTodaysRoute')}</Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ value, label, color, styles }: { value: number | string; label: string; color: string; styles: ReturnType<typeof makeStyles> }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  hero: { height: 120, borderRadius: radii.lg, overflow: 'hidden', marginBottom: spacing.lg },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', padding: 14, backgroundColor: 'rgba(20,22,26,0.35)' },
  heroText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 14.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing.lg },
  statCard: { width: '47%', backgroundColor: colors.coordBg, borderWidth: 1, borderColor: colors.coordBorder, borderRadius: radii.lg, padding: 14 },
  statValue: { fontFamily: fontFamily.extraBold, fontSize: 22 },
  statLabel: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.coordMuted },
  primaryButton: { backgroundColor: colors.green, borderRadius: radii.md, paddingVertical: 13, alignItems: 'center', marginBottom: 10 },
  primaryButtonText: { fontFamily: fontFamily.bold, fontSize: 13, color: '#fff' },
  outlineButton: { borderWidth: 1, borderColor: colors.coordBorder, borderRadius: radii.md, paddingVertical: 13, alignItems: 'center' },
  outlineButtonText: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.text },
});
