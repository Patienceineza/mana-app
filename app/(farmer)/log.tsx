import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { Crop } from '@/types';

export default function LogCropScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [qty, setQty] = useState('');

  const harvestDates = React.useMemo(() => {
    const days = [];
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 21; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        display: `${weekdayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`,
        raw: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      });
    }
    return days;
  }, []);

  const [date, setDate] = useState(harvestDates[0]?.raw ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<Crop[]>('/crops').then((res) => {
      setCrops(res);
      setSelectedKey(res[0]?.key ?? null);
    });
  }, []);

  const submit = async () => {
    if (!selectedKey || !qty) return;
    setSubmitting(true);
    try {
      await api.post('/harvest-logs', { cropKey: selectedKey, qtyKg: Number(qty), expectedHarvestDate: date });
      setSubmitted(true);
      setQty('');
      setDate(harvestDates[0]?.raw ?? '');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing.xl }}>
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Crop logged!</Text>
            <Text style={styles.successSubtitle}>A coordinator will confirm your collection date soon.</Text>
          </View>
          <PrimaryButton
            title="Back to Dashboard"
            onPress={() => {
              setSubmitted(false);
              router.replace('/(farmer)/home');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: TAB_BAR_CLEARANCE }}>
      <Text style={styles.title}>{t('logNewCrop').replace('+ ', '')}</Text>

      <Text style={styles.label}>{t('cropType')}</Text>
      <View style={styles.cropGrid}>
        {crops.map((crop) => {
          const active = crop.key === selectedKey;
          return (
            <Pressable
              key={crop.key}
              onPress={() => setSelectedKey(crop.key)}
              style={[styles.cropButton, { borderColor: active ? colors.greenDark : colors.border, backgroundColor: active ? colors.greenDark : colors.surface }]}
            >
              {crop.img && <Image source={{ uri: imageUrl(crop.img) }} style={styles.cropImage} resizeMode="cover" />}
              <Text style={[styles.cropLabel, { color: active ? '#fff' : colors.text }]}>{crop.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>{t('quantityKg')}</Text>
      <TextInput value={qty} onChangeText={setQty} placeholder="e.g. 150" placeholderTextColor={colors.textFainter} keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>{t('expectedHarvestDate')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
        {harvestDates.map((d) => {
          const active = d.raw === date;
          return (
            <Pressable
              key={d.raw}
              onPress={() => setDate(d.raw)}
              style={[
                styles.dateCard,
                active && { backgroundColor: colors.greenDark, borderColor: colors.greenDark },
              ]}
            >
              <Text style={[styles.dateText, active && { color: '#fff', fontFamily: fontFamily.bold }]}>
                {d.display}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <PrimaryButton
        title={t('submitCropLog')}
        onPress={submit}
        loading={submitting}
        disabled={!qty || !selectedKey}
        variant={qty ? 'green' : 'outline'}
      />
    </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  title: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.text, marginBottom: 16 },
  label: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.textFaint, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing.lg },
  cropButton: { width: '47%', borderWidth: 2, borderRadius: radii.lg, paddingVertical: 10, alignItems: 'center', gap: 6 },
  cropImage: { width: '88%', height: 64, borderRadius: 10 },
  cropLabel: { fontFamily: fontFamily.bold, fontSize: 12.5 },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    fontFamily: fontFamily.regular,
    marginBottom: spacing.lg,
  },
  successBox: { backgroundColor: colors.greenBg, borderWidth: 2, borderColor: colors.green, borderRadius: radii.xl, padding: 20, alignItems: 'center', marginBottom: 16 },
  successIcon: { fontSize: 30, marginBottom: 8 },
  successTitle: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.text, marginBottom: 4 },
  successSubtitle: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.textFaint, textAlign: 'center' },
  dateScroll: { gap: 8, marginBottom: spacing.xl, paddingVertical: 2 },
  dateCard: { borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dateText: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.text },
});
