import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, stockMeta, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { Crop, Product } from '@/types';

const STOCK_OPTIONS: { key: Product['stock']; label: string }[] = [
  { key: 'season', label: 'In Season' },
  { key: 'limited', label: 'Limited' },
  { key: 'low', label: 'Low' },
];

export default function FarmerListingsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);

  const [products, setProducts] = useState<Product[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState<Product['stock']>('season');
  const [imgPath, setImgPath] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const [mine, cropList] = await Promise.all([
      api.get<Product[]>('/products/mine'),
      api.get<Crop[]>('/crops'),
    ]);
    setProducts(mine);
    setCrops(cropList);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    if (!name || !price) return;
    setSubmitting(true);
    try {
      await api.post('/products', {
        name,
        price: Number(price),
        unit: 'kg',
        stockStatus: stock,
        description,
        imgPath: imgPath ?? undefined,
      });
      setName('');
      setPrice('');
      setDescription('');
      setStock('season');
      setImgPath(null);
      setShowForm(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('myListings')}</Text>
          <Pressable onPress={() => setShowForm((v) => !v)}>
            <Text style={styles.newLink}>{showForm ? 'Cancel' : t('newListing')}</Text>
          </Pressable>
        </View>

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.label}>{t('cropType')}</Text>
            <View style={styles.cropGrid}>
              {crops.map((crop) => {
                const active = crop.name === name;
                return (
                  <Pressable
                    key={crop.key}
                    onPress={() => {
                      setName(crop.name);
                      setImgPath(crop.img);
                    }}
                    style={[styles.cropButton, { borderColor: active ? colors.greenDark : colors.border, backgroundColor: active ? colors.greenDark : colors.surface }]}
                  >
                    <Text style={[styles.cropLabel, { color: active ? '#fff' : colors.text }]}>{crop.name}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>{t('productName')}</Text>
            <TextInput value={name} onChangeText={setName} placeholder="e.g. Tomatoes (Roma)" placeholderTextColor={colors.textFainter} style={styles.input} />

            <Text style={styles.label}>{t('pricePerUnit')}</Text>
            <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="e.g. 18.50" placeholderTextColor={colors.textFainter} style={styles.input} />

            <Text style={styles.label}>{t('stockStatus')}</Text>
            <View style={styles.stockRow}>
              {STOCK_OPTIONS.map((opt) => {
                const active = opt.key === stock;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setStock(opt.key)}
                    style={[styles.stockButton, { borderColor: active ? colors.greenDark : colors.border, backgroundColor: active ? colors.greenDark : colors.surface }]}
                  >
                    <Text style={{ fontFamily: fontFamily.bold, fontSize: 12, color: active ? '#fff' : colors.text }}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What makes this batch worth buying?"
              placeholderTextColor={colors.textFainter}
              multiline
              style={[styles.input, styles.multiline]}
            />

            <PrimaryButton title={t('submitListing')} onPress={submit} loading={submitting} disabled={!name || !price} style={{ marginTop: spacing.sm }} />
          </View>
        )}

        {products.length === 0 && !showForm && <Text style={styles.empty}>{t('noListingsYet')}</Text>}

        {products.map((p) => {
          const meta = stockMeta[p.stock];
          return (
            <View key={p.id} style={styles.card}>
              {p.img && <Image source={{ uri: imageUrl(p.img) }} style={styles.image} resizeMode="cover" />}
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.productName}>{p.name}</Text>
                  <StatusBadge label={meta.label} bg={colors[meta.bgKey]} color={colors[meta.colorKey]} />
                </View>
                <Text style={styles.price}>R{p.price.toFixed(2)} / {p.unit}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.text },
  newLink: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.green },
  form: { gap: 0, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg },
  label: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.textFaint, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, marginTop: spacing.sm },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropButton: { borderWidth: 2, borderRadius: radii.pill, paddingVertical: 8, paddingHorizontal: 14 },
  cropLabel: { fontFamily: fontFamily.bold, fontSize: 12 },
  stockRow: { flexDirection: 'row', gap: 8 },
  stockButton: { flex: 1, borderWidth: 2, borderRadius: radii.md, paddingVertical: 10, alignItems: 'center' },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
    fontFamily: fontFamily.regular,
  },
  multiline: { height: 70, textAlignVertical: 'top' },
  empty: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint, textAlign: 'center', marginTop: spacing.xl },
  card: { flexDirection: 'row', gap: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 12, marginBottom: 10 },
  image: { width: 56, height: 56, borderRadius: radii.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  productName: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.text },
  price: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textFaint },
});
