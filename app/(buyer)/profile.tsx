import React, { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { AccountSettings } from '@/components/AccountSettings';
import { SectionLabel } from '@/components/SectionLabel';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { BuyerStats, Product, BuyerRequest } from '@/types';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [requests, setRequests] = useState<BuyerRequest[]>([]);

  const load = useCallback(async () => {
    const [statsRes, favRes, reqRes] = await Promise.all([
      api.get<BuyerStats>('/profile/stats'),
      api.get<Product[]>('/favorites'),
      api.get<BuyerRequest[]>('/buyer-requests'),
    ]);
    setStats(statsRes);
    setFavorites(favRes);
    setRequests(reqRes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const getRequestStatusMeta = (colors: ThemeColors, status: BuyerRequest['status']) => {
    switch (status) {
      case 'open':
        return { label: 'Searching', bg: colors.surfaceAlt, color: colors.textFaint };
      case 'matched':
        return { label: 'Farmer Matched', bg: colors.amberBg, color: colors.amber };
      case 'fulfilled':
        return { label: 'Supply Secured', bg: colors.greenBg, color: colors.green };
      case 'cancelled':
        return { label: 'Cancelled', bg: colors.redBg, color: colors.red };
      default:
        return { label: status, bg: colors.surfaceAlt, color: colors.textFaint };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}>
      <View style={styles.hero}>
        <Image source={{ uri: imageUrl('/static/images/chef.jpg') }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroName}>{user?.name}</Text>
          <Text style={styles.heroBusiness}>{user?.businessName}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.statsGrid}>
          <StatTile styles={styles} value={stats?.totalOrders ?? 0} label={t('orders')} />
          <StatTile styles={styles} value={stats?.favoriteCount ?? favorites.length} label={t('saved')} />
          <StatTile styles={styles} value={stats?.farmsSourced ?? 0} label={t('farmsSourced')} />
        </View>

        <SectionLabel style={{ marginBottom: 10 }}>{t('savedProduce')}</SectionLabel>
        {favorites.length > 0 && (
          <View style={styles.favGrid}>
            {favorites.map((p) => (
              <View key={p.id} style={styles.favItem}>
                <Image source={{ uri: imageUrl(p.img) }} style={styles.favImage} resizeMode="cover" />
                <Text style={styles.favName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.favPrice}>R{p.price.toFixed(2)}/kg</Text>
              </View>
            ))}
          </View>
        )}

        {/* My Sourcing Requests Section */}
        <View style={styles.sectionHeader}>
          <SectionLabel style={{ marginBottom: 0 }}>My Supply Requests</SectionLabel>
          <Pressable onPress={() => router.push('/(buyer)/request-product')}>
            <Text style={styles.requestLink}>+ Request Crop</Text>
          </Pressable>
        </View>

        {requests.length === 0 ? (
          <View style={styles.emptyRequestsBox}>
            <Text style={styles.emptyRequestsText}>No crop requests submitted yet.</Text>
          </View>
        ) : (
          <View style={styles.requestsList}>
            {requests.map((r) => {
              const meta = getRequestStatusMeta(colors, r.status);
              return (
                <View key={r.id} style={styles.requestItem}>
                  <View style={styles.requestMain}>
                    <Text style={styles.requestCropName}>{r.cropName}</Text>
                    <Text style={styles.requestDetails}>
                      {r.qty} {r.unit} · Needed by {r.neededBy || 'ASAP'}
                    </Text>
                  </View>
                  <View style={{ alignSelf: 'center' }}>
                    <StatusBadge label={meta.label} bg={meta.bg} color={meta.color} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <SectionLabel style={{ marginBottom: 10 }}>{t('deliveryAddress')}</SectionLabel>
        <View style={styles.addressBox}>
          <Text style={styles.addressText}>{user?.address}</Text>
        </View>

        <View style={{ marginTop: spacing.xxl }}>
          <AccountSettings />
        </View>
      </View>
    </ScrollView>
  );
}

function StatTile({ value, label, styles }: { value: number; label: string; styles: ReturnType<typeof makeStyles> }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  hero: { height: 140 },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', padding: 18, backgroundColor: 'rgba(0,0,0,0.3)' },
  heroName: { color: '#fff', fontFamily: fontFamily.extraBold, fontSize: 16 },
  heroBusiness: { color: 'rgba(255,255,255,0.85)', fontFamily: fontFamily.regular, fontSize: 11.5 },
  body: { padding: spacing.xl },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: spacing.xxl },
  statTile: { flex: 1, backgroundColor: colors.surfaceMuted, borderRadius: radii.lg, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' },
  statValue: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.text },
  statLabel: { fontFamily: fontFamily.regular, fontSize: 10, color: colors.textFaint },
  favGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing.xl },
  favItem: { width: '31%' },
  favImage: { width: '100%', height: 88, borderRadius: radii.lg, marginBottom: 6, backgroundColor: colors.surfaceAlt },
  favName: { fontFamily: fontFamily.semiBold, fontSize: 10.5, color: colors.text },
  favPrice: { fontFamily: fontFamily.regular, fontSize: 10, color: colors.textFainter },
  addressBox: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 14, marginBottom: spacing.md },
  addressText: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.text },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: spacing.lg },
  requestLink: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.green },
  emptyRequestsBox: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 18, marginBottom: spacing.md, alignItems: 'center' },
  emptyRequestsText: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint },
  requestsList: { marginBottom: spacing.md, gap: 10 },
  requestItem: { flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 14, backgroundColor: colors.surfaceMuted },
  requestMain: { flex: 1, gap: 4 },
  requestCropName: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
  requestDetails: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textFaint },
});
