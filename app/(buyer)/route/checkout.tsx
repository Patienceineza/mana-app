import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionLabel } from '@/components/SectionLabel';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';
import type { OrderDetail } from '@/types';

const LOGISTICS_FEE = 45;
const COMMISSION_RATE = 0.08;

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { cart, refresh: refreshCart } = useCart();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [address, setAddress] = useState(user?.address ?? '');
  const [placing, setPlacing] = useState(false);

  const deliveryDates = React.useMemo(() => {
    const days = [];
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June'];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const val = `${weekdayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`;
      const short = `${weekdayNames[d.getDay()].substring(0, 3)} ${d.getDate()}`;
      days.push({ value: val, shortLabel: short });
    }
    return days;
  }, []);

  const timeSlots = [
    '07:00–09:00',
    '09:00–12:00',
    '12:00–15:00',
    '15:00–18:00',
  ];

  const [selectedDate, setSelectedDate] = useState(deliveryDates[0]?.value ?? '');
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);

  const commission = cart.subtotal * COMMISSION_RATE;
  const total = cart.subtotal + LOGISTICS_FEE + commission;

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const formattedDeliveryDate = `${selectedDate} · ${selectedTime}`;
      const order = await api.post<OrderDetail>('/orders', {
        address,
        deliveryDate: formattedDeliveryDate,
      });
      await refreshCart();
      router.replace(`/(buyer)/track?orderId=${order.id}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('checkout')}</Text>

        <SectionLabel style={{ marginBottom: 8 }}>{t('deliveryDate')}</SectionLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
          {deliveryDates.map((d) => {
            const active = d.value === selectedDate;
            return (
              <Pressable
                key={d.value}
                onPress={() => setSelectedDate(d.value)}
                style={[
                  styles.dateCard,
                  active && { backgroundColor: colors.green, borderColor: colors.green },
                ]}
              >
                <Text style={[styles.dateText, active && { color: '#fff', fontFamily: fontFamily.bold }]}>
                  {d.shortLabel}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <SectionLabel style={{ marginBottom: 8, marginTop: spacing.md }}>Delivery Time Slot</SectionLabel>
        <View style={styles.timeGrid}>
          {timeSlots.map((slot) => {
            const active = slot === selectedTime;
            return (
              <Pressable
                key={slot}
                onPress={() => setSelectedTime(slot)}
                style={[
                  styles.timeButton,
                  active && { backgroundColor: colors.green, borderColor: colors.green },
                ]}
              >
                <Text style={[styles.timeText, active && { color: '#fff', fontFamily: fontFamily.bold }]}>
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionLabel style={{ marginBottom: 6, marginTop: spacing.md }}>{t('deliveryAddress')}</SectionLabel>
        <TextInput value={address} onChangeText={setAddress} style={styles.input} />

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
            <Text style={styles.summaryValue}>R{cart.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Logistics fee</Text>
            <Text style={styles.summaryValue}>R{LOGISTICS_FEE.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>FreshRoute commission (8%)</Text>
            <Text style={styles.summaryValue}>R{commission.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R{total.toFixed(2)}</Text>
          </View>
        </View>

        <PrimaryButton title={t('placeOrder')} onPress={placeOrder} loading={placing} disabled={cart.items.length === 0} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xl, paddingTop: spacing.lg },
  title: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.text, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.text,
    fontFamily: fontFamily.regular,
    marginBottom: spacing.lg,
  },
  dateScroll: { gap: 8, marginBottom: spacing.md, paddingVertical: 2 },
  dateCard: { borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dateText: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.text },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  timeButton: { flex: 1, minWidth: '45%', borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  timeText: { fontFamily: fontFamily.medium, fontSize: 12, color: colors.text },
  summary: { backgroundColor: colors.surfaceMuted, borderRadius: radii.lg, padding: 16, marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.textFaint },
  summaryValue: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.textFaint },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 10 },
  totalLabel: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
  totalValue: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text },
});
