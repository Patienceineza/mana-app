import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChips } from '@/components/FilterChips';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, qcStatusMeta, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { QcInspection } from '@/types';

type StatusFilter = '' | 'pending' | 'passed' | 'rejected';

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'passed', label: 'Passed' },
  { value: 'rejected', label: 'Rejected' },
];

export default function InspectionsListScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [inspections, setInspections] = useState<QcInspection[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');

  const load = useCallback(async (status: StatusFilter) => {
    const query = status ? `?status=${status}` : '';
    const res = await api.get<QcInspection[]>(`/qc/inspections${query}`);
    setInspections(res);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(statusFilter);
    }, [load, statusFilter])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
      <Text style={styles.sectionLabel}>{t('pendingInspections')}</Text>
      <View style={{ marginBottom: spacing.md }}>
        <FilterChips options={STATUS_FILTER_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
      </View>
      {inspections.length === 0 && (
        <Text style={styles.empty}>No inspections match this filter.</Text>
      )}
      {inspections.map((q) => {
        const meta = qcStatusMeta[q.status];
        return (
          <Pressable key={q.id} style={styles.card} onPress={() => router.push(`/(coordinator)/inspections/${q.id}`)}>
            <Image source={{ uri: imageUrl(q.img) }} style={styles.image} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.crop}>{q.crop}</Text>
                <StatusBadge label={meta.label} bg={colors[meta.bgKey]} color={colors[meta.colorKey]} />
              </View>
              <Text style={styles.farm}>{q.farm}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.meta}>Expected: {q.expectedWeight} kg</Text>
                <Text style={styles.meta}>{q.stage}</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  sectionLabel: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.coordMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  empty: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.coordMuted, textAlign: 'center', marginTop: spacing.lg },
  card: { flexDirection: 'row', gap: 12, borderWidth: 1, borderColor: colors.coordBorder, backgroundColor: colors.coordBg, borderRadius: radii.md, padding: 12, marginBottom: 10 },
  image: { width: 62, height: 62, borderRadius: radii.md, backgroundColor: colors.coordBg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  crop: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.text },
  farm: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.coordMuted, marginBottom: 6 },
  meta: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.coordMuted },
});
