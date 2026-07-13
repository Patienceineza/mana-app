import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { QtyStepper } from '@/components/QtyStepper';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';

export default function CartScreen() {
  const { cart, refresh, setQty } = useCart();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('weeklyRoute')}</Text>

        {cart.items.length === 0 ? (
          <Text style={styles.empty}>Your route is empty. Add produce from the marketplace.</Text>
        ) : (
          cart.items.map((item) => (
            <View key={item.productId} style={styles.row}>
              <Image source={{ uri: imageUrl(item.img) }} style={styles.thumb} resizeMode="cover" />
              <View style={{ flex: 1, gap: 6 }}>
                <View style={styles.rowTop}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.lineTotal}>R{item.lineTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.rowBottom}>
                  <Text style={styles.itemUnit}>R{item.unitPrice.toFixed(2)}/kg</Text>
                  <QtyStepper qty={item.qty} onInc={() => setQty(item.productId, item.qty + 1)} onDec={() => setQty(item.productId, item.qty - 1)} />
                </View>
              </View>
            </View>
          ))
        )}

        {cart.items.length > 0 && (
          <>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>{t('subtotal')}</Text>
              <Text style={styles.subtotalValue}>R{cart.subtotal.toFixed(2)}</Text>
            </View>
            <PrimaryButton title={t('proceedToCheckout')} onPress={() => router.push('/(buyer)/route/checkout')} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xl, paddingTop: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE },
  title: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.text, marginBottom: 14 },
  empty: { textAlign: 'center', paddingVertical: 60, paddingHorizontal: 20, color: colors.textFaintest, fontSize: 13, fontFamily: fontFamily.regular },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.divider },
  thumb: { width: 60, height: 60, borderRadius: radii.lg, backgroundColor: colors.surfaceAlt },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontFamily: fontFamily.semiBold, fontSize: 14, color: colors.text, flex: 1, marginRight: 8 },
  itemUnit: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.textFainter },
  lineTotal: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
  subtotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, paddingBottom: 20 },
  subtotalLabel: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
  subtotalValue: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
});
