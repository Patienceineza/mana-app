import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import { deliveryStatusMeta, fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { Delivery } from '@/types';

export default function DriverDeliveriesScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const load = useCallback(async () => {
    const res = await api.get<Delivery[]>('/driver/deliveries');
    setDeliveries(res);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
        <Text style={styles.sectionLabel}>{t('assignedDeliveries')}</Text>
        {deliveries.length === 0 && <Text style={styles.empty}>{t('noDeliveriesAssigned')}</Text>}
        {deliveries.map((d) => {
          const meta = deliveryStatusMeta[d.status];
          return (
            <Pressable key={d.id} style={styles.card} onPress={() => router.push(`/(driver)/deliveries/${d.id}`)}>
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.orderCode}>{d.orderCode}</Text>
                  <StatusBadge label={meta.label} bg={colors[meta.bgKey]} color={colors[meta.colorKey]} />
                </View>
                <Text style={styles.address}>{d.address}</Text>
                <Text style={styles.meta}>{d.deliveryDate}</Text>
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
  sectionLabel: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.driverMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  empty: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.driverMuted },
  card: { borderWidth: 1, borderColor: colors.driverBorder, backgroundColor: colors.driverBg, borderRadius: radii.md, padding: 14, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderCode: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.text },
  address: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.driverMuted, marginBottom: 6 },
  meta: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.driverMuted },
});
