import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { QcInspection } from '@/types';

const PHOTO_STAGES = ['Farm Collection', 'Packing', 'Delivery'];

export default function InspectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [inspection, setInspection] = useState<QcInspection | null>(null);
  const [actualWeight, setActualWeight] = useState('');
  const [decision, setDecision] = useState<'accept' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const res = await api.get<QcInspection>(`/qc/inspections/${id}`);
    setInspection(res);
    setActualWeight(res.actualWeight != null ? String(res.actualWeight) : '');
    setNotes(res.notes ?? '');
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePhoto = async (stage: string) => {
    if (!inspection) return;
    const current = inspection.photos.find((p) => p.stage === stage)?.uploaded ?? false;
    const updated = await api.patch<QcInspection>(`/qc/inspections/${id}`, { photos: { [stage]: !current } });
    setInspection(updated);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.patch(`/qc/inspections/${id}`, {
        actualWeight: actualWeight ? Number(actualWeight) : undefined,
        decision,
        notes,
      });
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  if (!inspection) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Text style={styles.backLink}>← Back to list</Text>
      </Pressable>

      <View style={styles.headerCard}>
        <Text style={styles.crop}>{inspection.crop}</Text>
        <Text style={styles.farm}>{inspection.farm}</Text>
      </View>

      <Text style={styles.sectionLabel}>{t('qualityPhotos')}</Text>
      <View style={styles.photoGrid}>
        {PHOTO_STAGES.map((stage) => {
          const uploaded = inspection.photos.find((p) => p.stage === stage)?.uploaded ?? false;
          return (
            <Pressable key={stage} onPress={() => togglePhoto(stage)} style={[styles.photoButton, uploaded && styles.photoButtonActive]}>
              <Text style={{ fontSize: 16, color: uploaded ? colors.green : colors.coordMuted }}>{uploaded ? '✓' : '📷'}</Text>
              <Text style={styles.photoLabel}>{stage}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>{t('weightVerification')}</Text>
      <View style={styles.weightRow}>
        <View style={styles.weightBox}>
          <Text style={styles.weightBoxLabel}>Expected</Text>
          <Text style={styles.weightBoxValue}>{inspection.expectedWeight} kg</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.weightBoxLabel}>Actual (kg)</Text>
          <TextInput value={actualWeight} onChangeText={setActualWeight} keyboardType="numeric" style={styles.weightInput} placeholderTextColor={colors.textFainter} />
        </View>
      </View>

      <Text style={styles.sectionLabel}>{t('decision')}</Text>
      <View style={styles.decisionRow}>
        <Pressable
          onPress={() => setDecision('accept')}
          style={[styles.decisionButton, decision === 'accept' && { borderColor: colors.green, backgroundColor: colors.greenBg }]}
        >
          <Text style={{ fontFamily: fontFamily.bold, fontSize: 13, color: decision === 'accept' ? colors.green : colors.coordMuted }}>{t('accept')}</Text>
        </Pressable>
        <Pressable
          onPress={() => setDecision('reject')}
          style={[styles.decisionButton, decision === 'reject' && { borderColor: colors.red, backgroundColor: colors.redBg }]}
        >
          <Text style={{ fontFamily: fontFamily.bold, fontSize: 13, color: decision === 'reject' ? colors.red : colors.coordMuted }}>{t('reject')}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>{t('notes')}</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional inspection notes…"
        placeholderTextColor={colors.textFainter}
        multiline
        style={styles.notesInput}
      />

      <Pressable
        onPress={submit}
        disabled={!decision || submitting}
        style={[styles.submitButton, { backgroundColor: decision ? colors.green : colors.border }]}
      >
        <Text style={[styles.submitButtonText, { color: decision ? '#fff' : colors.coordMuted }]}>
          {submitting ? 'Submitting…' : t('submitInspection')}
        </Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  backLink: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.green },
  headerCard: { backgroundColor: colors.coordBg, borderWidth: 1, borderColor: colors.coordBorder, borderRadius: radii.md, padding: 14, marginBottom: 16 },
  crop: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.text, marginBottom: 2 },
  farm: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.coordMuted },
  sectionLabel: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.coordMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  photoGrid: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  photoButton: { flex: 1, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: radii.md, height: 76, alignItems: 'center', justifyContent: 'center', gap: 4 },
  photoButtonActive: { backgroundColor: colors.greenBg, borderColor: colors.green, borderStyle: 'solid' },
  photoLabel: { fontFamily: fontFamily.semiBold, fontSize: 8, color: colors.coordMuted, textAlign: 'center' },
  weightRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.lg },
  weightBox: { flex: 1, backgroundColor: colors.coordBg, borderWidth: 1, borderColor: colors.coordBorder, borderRadius: radii.md, padding: 10 },
  weightBoxLabel: { fontFamily: fontFamily.regular, fontSize: 10, color: colors.coordMuted, marginBottom: 3 },
  weightBoxValue: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
  weightInput: { backgroundColor: colors.coordBg, borderWidth: 1, borderColor: colors.coordBorder, borderRadius: radii.md, padding: 10, fontSize: 14, color: colors.text, fontFamily: fontFamily.regular },
  decisionRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  decisionButton: { flex: 1, borderWidth: 1, borderColor: colors.coordBorder, borderRadius: radii.md, paddingVertical: 10, alignItems: 'center' },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.coordBorder,
    backgroundColor: colors.coordBg,
    borderRadius: radii.md,
    padding: 10,
    fontSize: 12.5,
    color: colors.text,
    fontFamily: fontFamily.regular,
    height: 60,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  submitButton: { borderRadius: radii.lg, paddingVertical: 14, alignItems: 'center', marginBottom: spacing.xl },
  submitButtonText: { fontFamily: fontFamily.bold, fontSize: 13.5 },
});
