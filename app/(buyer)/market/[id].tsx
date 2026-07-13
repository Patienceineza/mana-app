import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { QtyStepper } from '@/components/QtyStepper';
import { StatusBadge } from '@/components/StatusBadge';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, stockMeta, ThemeColors } from '@/constants/theme';
import type { Product } from '@/types';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refresh: refreshCart } = useCart();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [product, setProduct] = useState<Product | null>(null);
  const insets = useSafeAreaInsets();

  const load = useCallback(async () => {
    const res = await api.get<Product>(`/products/${id}`);
    setProduct(res);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!product) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  const meta = stockMeta[product.stock];

  const mutate = async (action: () => Promise<unknown>) => {
    await action();
    await Promise.all([load(), refreshCart()]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUrl(product.img) }} style={styles.image} />
        <Pressable style={[styles.circleButton, { left: 14, top: insets.top + 10 }]} onPress={() => router.back()}>
          <Text style={{ fontSize: 15, color: colors.text }}>←</Text>
        </Pressable>
        <Pressable
          style={[styles.circleButton, { right: 14, top: insets.top + 10 }]}
          onPress={() =>
            mutate(() =>
              product.isFavorite ? api.delete(`/favorites/${product.id}`) : api.post(`/favorites/${product.id}`),
            )
          }
        >
          <Text style={{ fontSize: 16, color: product.isFavorite ? colors.red : colors.text }}>
            {product.isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.name}</Text>
          <StatusBadge label={meta.label} bg={colors[meta.bgKey]} color={colors[meta.colorKey]} />
        </View>
        <Text style={styles.farm}>{product.farm}</Text>
        <Text style={styles.price}>
          R{product.price.toFixed(2)}
          <Text style={styles.unit}> /{product.unit}</Text>
        </Text>
        <Text style={styles.desc}>{product.description}</Text>

        {product.cartQty > 0 ? (
          <>
            <View style={styles.stepperRow}>
              <QtyStepper
                qty={product.cartQty}
                size="lg"
                onDec={() => mutate(() => api.patch(`/cart/${product.id}`, { qty: product.cartQty - 1 }))}
                onInc={() => mutate(() => api.post('/cart', { productId: product.id, qty: 1 }))}
              />
              <Text style={styles.inRoute}>in route</Text>
            </View>
            <PrimaryButton title="View Weekly Route →" variant="dark" onPress={() => router.push('/(buyer)/route')} />
          </>
        ) : (
          <PrimaryButton
            title="Add to Route"
            onPress={() => mutate(() => api.post('/cart', { productId: product.id, qty: 1 }))}
          />
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  imageWrap: { height: 220 },
  image: { width: '100%', height: '100%' },
  circleButton: {
    position: 'absolute',
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 8 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 18, color: colors.text, flex: 1 },
  farm: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.textFaint, marginBottom: 14 },
  price: { fontFamily: fontFamily.extraBold, fontSize: 19, color: colors.text, marginBottom: 14 },
  unit: { fontFamily: fontFamily.medium, fontSize: 12, color: colors.textFaintest },
  desc: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 20, color: colors.textFaint, marginBottom: 18 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.greenBg, borderRadius: radii.lg, paddingVertical: 10, paddingHorizontal: 16, marginBottom: 12 },
  inRoute: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
});
