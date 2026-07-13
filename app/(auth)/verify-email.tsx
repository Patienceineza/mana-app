import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Wordmark } from '@/components/Wordmark';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ApiError } from '@/lib/api';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';

export default function VerifyEmailScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { verifyEmail, resendVerification, user } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [email, setEmail] = useState(emailParam ?? user?.email ?? '');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async () => {
    if (!email || !code) {
      setError('Email and code are required.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyEmail(email, code);
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not verify your email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) return;
    setResending(true);
    setError(null);
    setInfo(null);
    try {
      await resendVerification(email);
      setInfo('A new code has been sent if that email is registered.');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Wordmark />
            <Text style={styles.tagline}>Verify your email</Text>
          </View>

          <Text style={styles.hint}>
            We emailed a 6-digit code to confirm your address. You can keep using the app in the meantime — this
            just confirms it's really you.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={colors.textFainter}
            style={styles.input}
          />

          <Text style={styles.label}>Verification code</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            placeholder="123456"
            placeholderTextColor={colors.textFainter}
            maxLength={6}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <PrimaryButton title="Verify Email" onPress={submit} loading={loading} style={{ marginTop: spacing.md }} />
          <PrimaryButton title="Resend Code" onPress={resend} loading={resending} variant="outline" style={{ marginTop: spacing.sm }} />

          <Text style={styles.skipLink} onPress={() => router.replace('/')}>
            Skip for now
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, padding: spacing.xl, gap: spacing.xs, justifyContent: 'center' },
  header: { alignItems: 'center', gap: 6, marginBottom: spacing.lg },
  tagline: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint },
  hint: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.textFaint, textAlign: 'center', marginBottom: spacing.md },
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
  info: { color: colors.green, fontFamily: fontFamily.medium, fontSize: 12.5, marginTop: 6 },
  skipLink: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12.5,
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
