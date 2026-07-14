import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChips } from '@/components/FilterChips';
import { ProductCard } from '@/components/ProductCard';
import { SectionLabel } from '@/components/SectionLabel';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { Product } from '@/types';

type StockFilter = '' | 'season' | 'limited' | 'low';

const STOCK_FILTER_OPTIONS: { value: StockFilter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'season', label: 'In Season' },
  { value: 'limited', label: 'Limited' },
  { value: 'low', label: 'Low Stock' },
];

export default function MarketScreen() {
  const { user } = useAuth();
  const { refresh: refreshCart } = useCart();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async (query: string, stock: StockFilter) => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (stock) params.set('stockStatus', stock);
    const qs = params.toString();
    const res = await api.get<Product[]>(`/products${qs ? `?${qs}` : ''}`);
    setProducts(res);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadProducts(search, stockFilter).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, stockFilter, loadProducts]);

  useFocusEffect(
    useCallback(() => {
      refreshCart();
    }, [refreshCart])
  );

  const mutateCart = async (action: () => Promise<void>) => {
    await action();
    await Promise.all([loadProducts(search, stockFilter), refreshCart()]);
  };

  const toggleFavorite = async (product: Product) => {
    if (product.isFavorite) {
      await api.delete(`/favorites/${product.id}`);
    } else {
      await api.post(`/favorites/${product.id}`);
    }
    await loadProducts(search, stockFilter);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{t('goodMorning')}</Text>
            <Text style={styles.name}>{user?.name}</Text>
          </View>
        </View>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={colors.textFainter}
          style={styles.search}
        />
        <View style={{ marginTop: spacing.sm }}>
          <FilterChips options={STOCK_FILTER_OPTIONS} value={stockFilter} onChange={setStockFilter} />
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => String(p.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.md }}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={() => loadProducts(search, stockFilter)}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Image source={{ uri: imageUrl('/static/images/supermarket.jpg') }} style={styles.heroImage} />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>Fresh from South Africa's farms</Text>
                <Text style={styles.heroSubtitle}>Sourced daily, delivered on your schedule</Text>
              </View>
            </View>
            <SectionLabel style={{ marginBottom: 10 }}>{t('todaysMarket')}</SectionLabel>
          </>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/(buyer)/market/${item.id}`)}
            onToggleFavorite={() => toggleFavorite(item)}
            onAdd={() => mutateCart(() => api.post('/cart', { productId: item.id, qty: 1 }).then(() => {}))}
            onInc={() => mutateCart(() => api.post('/cart', { productId: item.id, qty: 1 }).then(() => {}))}
            onDec={() =>
              mutateCart(() =>
                api.patch(`/cart/${item.id}`, { qty: Math.max(0, item.cartQty - 1) }).then(() => {}),
              )
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          !loading ? (
            search.trim() ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>Can't find "{search}"?</Text>
                  <Text style={styles.emptySubtitle}>
                    Submit a sourcing request, and we will find local farmers who can harvest it for you!
                  </Text>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/(buyer)/request-product',
                        params: { cropName: search },
                      })
                    }
                    style={styles.requestButton}
                  >
                    <Text style={styles.requestButtonText}>Request "{search}"</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Text style={styles.emptyText}>No products available right now.</Text>
            )
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textFaint },
  name: { fontFamily: fontFamily.bold, fontSize: 17, color: colors.text },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.text,
    fontFamily: fontFamily.regular,
  },
  listContent: { padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE, backgroundColor: colors.bg, flexGrow: 1 },
  hero: { height: 120, borderRadius: radii.xl, overflow: 'hidden', marginBottom: spacing.lg },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', padding: 14, backgroundColor: 'rgba(0,0,0,0.25)' },
  heroTitle: { color: '#fff', fontFamily: fontFamily.extraBold, fontSize: 15, lineHeight: 19 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', fontFamily: fontFamily.regular, fontSize: 11, marginTop: 2 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.sm },
  emptyCard: { width: '100%', backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: 18, alignItems: 'center' },
  emptyTitle: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.text, marginBottom: 6 },
  emptySubtitle: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.textFaint, textAlign: 'center', marginBottom: spacing.md, lineHeight: 18 },
  requestButton: { backgroundColor: colors.green, borderRadius: radii.md, paddingVertical: 10, paddingHorizontal: 16 },
  requestButtonText: { fontFamily: fontFamily.bold, fontSize: 12.5, color: '#fff' },
  emptyText: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint, textAlign: 'center', marginTop: spacing.xl },
});
