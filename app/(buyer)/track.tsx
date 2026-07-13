import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { OrderDetail, OrderSummary } from '@/types';

export default function TrackScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      let id = orderId;
      if (!id) {
        const orders = await api.get<OrderSummary[]>('/orders');
        if (orders.length === 0) {
          setOrder(null);
          setNotFound(true);
          return;
        }
        id = orders[0].id;
      }
      const detail = await api.get<OrderDetail>(`/orders/${id}`);
      setOrder(detail);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);



  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  if (notFound || !order) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loading}>
          <Text style={styles.emptyText}>No orders yet. Place an order to track its delivery here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.orderId}>Order {order.orderCode}</Text>
          <Text style={styles.eta}>ETA {order.eta}</Text>
        </View>

        <View style={styles.hero}>
          <Image source={{ uri: imageUrl('/static/images/truck.jpg') }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>On the road — live delivery route</Text>
          </View>
        </View>

        <View style={{ marginBottom: spacing.lg }}>
          {order.trackingSteps.map((step, i) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepIndicatorCol}>
                <View style={[styles.dot, { backgroundColor: step.done ? colors.green : colors.borderLight }]}>
                  <Text style={{ fontSize: 11, fontFamily: fontFamily.bold, color: step.done ? '#fff' : colors.textFaintest }}>
                    {step.done ? '✓' : i + 1}
                  </Text>
                </View>
                {i < order.trackingSteps.length - 1 && (
                  <View style={[styles.line, { backgroundColor: i < order.trackingStage ? colors.green : colors.borderLight }]} />
                )}
              </View>
              <View style={{ paddingBottom: 22 }}>
                <Text style={{ fontFamily: fontFamily.semiBold, fontSize: 13, color: step.done ? colors.text : colors.textFaintest }}>
                  {step.label}
                </Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>



        <Text style={styles.sectionLabel}>Farm Traceability</Text>
        {order.traceFarms.map((farm) => (
          <View key={farm.name} style={styles.farmRow}>
            <Image source={{ uri: imageUrl(farm.img) }} style={styles.farmThumb} resizeMode="cover" />
            <View>
              <Text style={styles.farmName}>{farm.name}</Text>
              <Text style={styles.farmVerified}>✓ FreshRoute Verified Fresh</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyText: { textAlign: 'center', color: colors.textFaintest, fontFamily: fontFamily.regular, fontSize: 13 },
  container: { padding: spacing.xl, paddingTop: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  orderId: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.text },
  eta: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.textFainter },
  hero: { height: 120, borderRadius: radii.lg, overflow: 'hidden', marginVertical: 14, marginBottom: 18 },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', padding: 14, backgroundColor: 'rgba(0,0,0,0.25)' },
  heroText: { color: '#fff', fontFamily: fontFamily.semiBold, fontSize: 11.5 },
  stepRow: { flexDirection: 'row', gap: 12 },
  stepIndicatorCol: { alignItems: 'center' },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  line: { width: 2, flex: 1, minHeight: 22 },
  stepTime: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.textFainter },

  sectionLabel: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.textFaintest, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  farmRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.divider },
  farmThumb: { width: 48, height: 48, borderRadius: radii.md, backgroundColor: colors.surfaceAlt },
  farmName: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.text },
  farmVerified: { fontFamily: fontFamily.regular, fontSize: 10.5, color: colors.green },
});
