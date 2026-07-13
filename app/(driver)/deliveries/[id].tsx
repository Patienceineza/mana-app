import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import { deliveryStatusMeta, fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { Delivery, DeliveryStatus } from '@/types';

const NEXT_STATUS: Partial<Record<DeliveryStatus, { next: DeliveryStatus; labelKey: 'markPickedUp' | 'markInTransit' | 'markDelivered' }>> = {
  assigned: { next: 'picked_up', labelKey: 'markPickedUp' },
  picked_up: { next: 'in_transit', labelKey: 'markInTransit' },
  in_transit: { next: 'delivered', labelKey: 'markDelivered' },
};

export default function DriverDeliveryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const all = await api.get<Delivery[]>('/driver/deliveries');
    const res = all.find((d) => d.id === id) ?? null;
    if (res) {
      setDelivery(res);
      setNotes(res.notes ?? '');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const advance = async (next: DeliveryStatus) => {
    setBusy(true);
    try {
      const updated = await api.patch<Delivery>(`/driver/deliveries/${id}`, { status: next });
      setDelivery(updated);
    } finally {
      setBusy(false);
    }
  };

  const saveNotes = async () => {
    setBusy(true);
    try {
      const updated = await api.patch<Delivery>(`/driver/deliveries/${id}`, { notes });
      setDelivery(updated);
    } finally {
      setBusy(false);
    }
  };

  const reportIssue = async () => {
    setBusy(true);
    try {
      await api.patch(`/driver/deliveries/${id}`, { status: 'failed', notes });
      router.back();
    } finally {
      setBusy(false);
    }
  };

  if (!delivery) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  const meta = deliveryStatusMeta[delivery.status];
  const nextStep = NEXT_STATUS[delivery.status];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Text style={styles.backLink}>{t('backToDeliveries')}</Text>
        </Pressable>

        <View style={styles.headerCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderCode}>{delivery.orderCode}</Text>
            <StatusBadge label={meta.label} bg={colors[meta.bgKey]} color={colors[meta.colorKey]} />
          </View>
          <Text style={styles.sectionLabel}>{t('deliveryAddressLabel')}</Text>
          <Text style={styles.address}>{delivery.address}</Text>
          <Text style={styles.meta}>{delivery.deliveryDate}</Text>
        </View>

        {nextStep && (
          <Pressable disabled={busy} onPress={() => advance(nextStep.next)} style={[styles.primaryButton, busy && { opacity: 0.6 }]}>
            <Text style={styles.primaryButtonText}>{t(nextStep.labelKey)}</Text>
          </Pressable>
        )}

        <Text style={styles.sectionLabel}>{t('deliveryNotes')}</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional delivery notes…"
          placeholderTextColor={colors.textFainter}
          multiline
          style={styles.notesInput}
        />
        <Pressable disabled={busy} onPress={saveNotes} style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>{t('saveNotes')}</Text>
        </Pressable>

        {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
          <Pressable disabled={busy} onPress={reportIssue} style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>{t('reportIssue')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  backLink: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.green },
  headerCard: { backgroundColor: colors.driverBg, borderWidth: 1, borderColor: colors.driverBorder, borderRadius: radii.md, padding: 14, marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderCode: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.text },
  sectionLabel: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.driverMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, marginTop: 6 },
  address: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.text, marginBottom: 2 },
  meta: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.driverMuted },
  primaryButton: { backgroundColor: colors.green, borderRadius: radii.lg, paddingVertical: 14, alignItems: 'center', marginBottom: spacing.lg },
  primaryButtonText: { fontFamily: fontFamily.bold, fontSize: 13.5, color: '#fff' },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.driverBorder,
    backgroundColor: colors.driverBg,
    borderRadius: radii.md,
    padding: 10,
    fontSize: 12.5,
    color: colors.text,
    fontFamily: fontFamily.regular,
    height: 70,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  outlineButton: { borderWidth: 1, borderColor: colors.driverBorder, borderRadius: radii.md, paddingVertical: 12, alignItems: 'center', marginBottom: spacing.lg },
  outlineButtonText: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.text },
  dangerButton: { borderWidth: 1, borderColor: colors.red, borderRadius: radii.md, paddingVertical: 12, alignItems: 'center', marginBottom: spacing.xl },
  dangerButtonText: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.red },
});
