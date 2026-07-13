import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { FarmerStats, PayoutsResponse } from '@/types';

const PAYOUT_STAGE_LABELS = ['Submitted', 'Verified', 'Processing', 'Paid'];

export default function EarningsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [payouts, setPayouts] = useState<PayoutsResponse | null>(null);
  const [stats, setStats] = useState<FarmerStats | null>(null);

  useEffect(() => {
    api.get<PayoutsResponse>('/payouts').then(setPayouts);
    api.get<FarmerStats>('/farmer/stats').then(setStats);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: TAB_BAR_CLEARANCE }}>
      <Text style={styles.title}>{t('myEarnings')}</Text>

      {payouts?.pending && (
        <View style={styles.pendingCard}>
          <Text style={styles.pendingLabel}>{t('pendingPayout')} · R {payouts.pending.amount.toFixed(0)}</Text>
          <View style={styles.stageRow}>
            {PAYOUT_STAGE_LABELS.map((label, i) => {
              const done = i <= payouts.pending!.stageIndex;
              return (
                <View key={label} style={styles.stageItem}>
                  <View style={[styles.stageDot, { backgroundColor: done ? colors.greenDark : colors.border }]}>
                    <Text style={{ fontSize: 12, fontFamily: fontFamily.bold, color: done ? '#fff' : colors.text }}>
                      {done ? '✓' : i + 1}
                    </Text>
                  </View>
                  <Text style={[styles.stageLabel, { color: done ? colors.text : colors.textFaintest }]}>{label}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.pendingNote}>Payout expected within 24–48 hours of collection</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>{t('completedPayouts')}</Text>
      {payouts?.completed.map((p) => (
        <View key={p.id} style={styles.payoutRow}>
          <View>
            <Text style={styles.payoutCrop}>{p.cropLabel}</Text>
            <Text style={styles.payoutDate}>{p.paidAt}</Text>
          </View>
          <Text style={styles.payoutAmount}>R {p.amount.toFixed(0)}</Text>
        </View>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>{t('trustRating')}</Text>
      <View style={styles.trustBar}>
        <View style={[styles.trustFill, { width: `${stats?.trustScore ?? 0}%` }]} />
      </View>
      <Text style={styles.trustLabel}>{stats?.trustLabel} — based on quality &amp; on-time delivery</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  title: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.text, marginBottom: spacing.lg },
  pendingCard: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radii.xl, padding: 18, marginBottom: spacing.lg },
  pendingLabel: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.textFaint, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  stageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stageItem: { alignItems: 'center', gap: 6, flex: 1 },
  stageDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  stageLabel: { fontFamily: fontFamily.semiBold, fontSize: 10, textAlign: 'center' },
  pendingNote: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.textFainter, marginTop: 10, textAlign: 'center' },
  sectionLabel: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.textFaint, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  payoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  payoutCrop: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.text },
  payoutDate: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.textFaint },
  payoutAmount: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.green },
  trustBar: { backgroundColor: colors.border, borderRadius: radii.pill, height: 14, overflow: 'hidden', marginBottom: 6 },
  trustFill: { height: '100%', backgroundColor: colors.green, borderRadius: radii.pill },
  trustLabel: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textFaint },
});
