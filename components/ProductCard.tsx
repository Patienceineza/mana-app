import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { QtyStepper } from './QtyStepper';
import { imageUrl } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import { fontFamily, radii, stockMeta, ThemeColors } from '@/constants/theme';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onToggleFavorite: () => void;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}

export function ProductCard({ product, onPress, onToggleFavorite, onAdd, onInc, onDec }: ProductCardProps) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const meta = stockMeta[product.stock];
  const metaColor = colors[meta.colorKey];
  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.imageWrap}>
        <Image source={{ uri: imageUrl(product.img) }} style={styles.image} resizeMode="cover" />
        <View style={styles.stockBadge}>
          <Text style={[styles.stockBadgeText, { color: metaColor }]}>{meta.label}</Text>
        </View>
        <Pressable onPress={onToggleFavorite} style={styles.favButton} hitSlop={8}>
          <Text style={{ fontSize: 14, color: product.isFavorite ? colors.red : 'rgba(28,28,30,0.4)' }}>
            {product.isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.farm} numberOfLines={1}>{product.farm}</Text>
        <Text style={styles.price}>
          R{product.price.toFixed(2)}
          <Text style={styles.unit}>/{product.unit}</Text>
        </Text>
        {product.cartQty > 0 ? (
          <QtyStepper qty={product.cartQty} onInc={onInc} onDec={onDec} size="md" />
        ) : (
          <Pressable onPress={onAdd} style={styles.addButton}>
            <Text style={styles.addLabel}>Add to Route</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: radii.xl,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    imageWrap: { height: 148, position: 'relative', backgroundColor: colors.surfaceAlt },
    image: { width: '100%', height: '100%' },
    stockBadge: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: 'rgba(255,255,255,0.95)',
      paddingVertical: 3,
      paddingHorizontal: 7,
      borderRadius: radii.sm,
    },
    stockBadgeText: { fontFamily: fontFamily.bold, fontSize: 9 },
    favButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: 'rgba(255,255,255,0.95)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: { padding: 11, paddingTop: 10, gap: 4, backgroundColor: colors.surface },
    name: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.text },
    farm: { fontFamily: fontFamily.regular, fontSize: 10.5, color: colors.textFainter, marginBottom: 2 },
    price: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text, marginBottom: 8 },
    unit: { fontFamily: fontFamily.medium, fontSize: 10.5, color: colors.textFaintest },
    addButton: {
      backgroundColor: colors.green,
      borderRadius: radii.sm,
      paddingVertical: 9,
      alignItems: 'center',
    },
    addLabel: { fontFamily: fontFamily.bold, fontSize: 11.5, color: '#fff' },
  });
