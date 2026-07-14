import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChips } from '@/components/FilterChips';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import { deliveryStatusMeta, fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { CoordDelivery, DriverOption } from '@/types';

type StatusFilter = '' | 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
];

export default function CoordinatorDeliveriesScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [deliveries, setDeliveries] = useState<CoordDelivery[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');

  const load = useCallback(async (status: StatusFilter) => {
    const query = status ? `?status=${status}` : '';
    const [d, drv] = await Promise.all([
      api.get<CoordDelivery[]>(`/coordinator/deliveries${query}`),
      api.get<DriverOption[]>('/coordinator/drivers'),
    ]);
    setDeliveries(d);
    setDrivers(drv);
  }, []);

  useEffect(() => {
    load(statusFilter);
  }, [load, statusFilter]);

  const assign = async (deliveryId: string, driverId: string) => {
    setAssigning(deliveryId);
    try {
      await api.patch(`/coordinator/deliveries/${deliveryId}/assign`, { driverId });
      await load(statusFilter);
    } finally {
      setAssigning(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
        <Text style={styles.sectionLabel}>Deliveries</Text>
        <View style={{ marginBottom: spacing.md }}>
          <FilterChips options={STATUS_FILTER_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </View>
        {deliveries.length === 0 && <Text style={styles.empty}>No deliveries match this filter.</Text>}
        {deliveries.map((d) => {
          const meta = deliveryStatusMeta[d.status];
          return (
            <View key={d.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.orderCode}>{d.orderCode}</Text>
                <StatusBadge label={meta.label} bg={colors[meta.bgKey]} color={colors[meta.colorKey]} />
              </View>
              <Text style={styles.address}>{d.address}</Text>
              <Text style={styles.meta}>{d.driverName ? `Driver: ${d.driverName}` : 'Unassigned'}</Text>

              {!d.driverId && (
                <View style={styles.driverRow}>
                  {drivers.map((drv) => (
                    <Pressable
                      key={drv.id}
                      disabled={assigning === d.id}
                      onPress={() => assign(d.id, drv.id)}
                      style={[styles.driverChip, assigning === d.id && { opacity: 0.6 }]}
                    >
                      <Text style={styles.driverChipText}>Assign {drv.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
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
  card: { borderWidth: 1, borderColor: colors.coordBorder, backgroundColor: colors.coordBg, borderRadius: radii.md, padding: 14, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderCode: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.text },
  address: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.coordMuted, marginBottom: 4 },
  meta: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.coordMuted, marginBottom: 6 },
  driverRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  driverChip: { borderWidth: 1, borderColor: colors.green, backgroundColor: colors.greenBg, borderRadius: radii.pill, paddingVertical: 6, paddingHorizontal: 12 },
  driverChipText: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.green },
});
