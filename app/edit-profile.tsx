import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ApiError } from '@/lib/api';
import { isValidPhone } from '@/lib/validation';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [businessName, setBusinessName] = useState(user?.businessName ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [farmName, setFarmName] = useState(user?.farmName ?? '');
  const [region, setRegion] = useState(user?.region ?? '');
  const [vehicleLabel, setVehicleLabel] = useState(user?.vehicleLabel ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setSaved(false);
    if (phone && !isValidPhone(phone)) {
      setError('Enter a valid phone number with country code, e.g. +254712345678.');
      return;
    }
    setLoading(true);
    try {
      await updateProfile({ name, phone, businessName, address, farmName, region, vehicleLabel });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.md }}>
            <Text style={styles.backLink}>← Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Avatar name={name || '?'} size={64} />
            <Text style={styles.title}>Edit Profile</Text>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.textFainter} style={styles.input} />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+27 82 000 0000"
            placeholderTextColor={colors.textFainter}
            style={styles.input}
          />

          {user?.role === 'buyer' && (
            <>
              <Text style={styles.label}>Business Name</Text>
              <TextInput value={businessName} onChangeText={setBusinessName} placeholderTextColor={colors.textFainter} style={styles.input} />
              <Text style={styles.label}>Delivery Address</Text>
              <TextInput value={address} onChangeText={setAddress} placeholderTextColor={colors.textFainter} style={styles.input} />
            </>
          )}

          {user?.role === 'farmer' && (
            <>
              <Text style={styles.label}>Farm Name</Text>
              <TextInput value={farmName} onChangeText={setFarmName} placeholderTextColor={colors.textFainter} style={styles.input} />
              <Text style={styles.label}>Region</Text>
              <TextInput value={region} onChangeText={setRegion} placeholderTextColor={colors.textFainter} style={styles.input} />
            </>
          )}

          {user?.role === 'coordinator' && (
            <>
              <Text style={styles.label}>Region</Text>
              <TextInput value={region} onChangeText={setRegion} placeholderTextColor={colors.textFainter} style={styles.input} />
            </>
          )}

          {user?.role === 'driver' && (
            <>
              <Text style={styles.label}>Vehicle</Text>
              <TextInput value={vehicleLabel} onChangeText={setVehicleLabel} placeholderTextColor={colors.textFainter} style={styles.input} />
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {saved ? <Text style={styles.saved}>Saved.</Text> : null}

          <PrimaryButton title="Save Changes" onPress={submit} loading={loading} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, padding: spacing.xl, gap: spacing.xs },
  backLink: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.green },
  header: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.extraBold, fontSize: 18, color: colors.text },
  label: { fontFamily: fontFamily.semiBold, fontSize: 12, color: colors.textFaint, marginTop: spacing.sm, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
    fontFamily: fontFamily.regular,
  },
  error: { color: colors.red, fontFamily: fontFamily.medium, fontSize: 12.5, marginTop: 6 },
  saved: { color: colors.green, fontFamily: fontFamily.medium, fontSize: 12.5, marginTop: 6 },
});
