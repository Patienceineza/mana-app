import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Wordmark } from '@/components/Wordmark';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ApiError } from '@/lib/api';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';

export default function ActivateAccountScreen() {
  const { activateAccount } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !code || password.length < 8) {
      setError('Email, activation code, and a password of at least 8 characters are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await activateAccount(email, code, password);
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not activate your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Wordmark />
            <Text style={styles.tagline}>Activate your account</Text>
          </View>

          <Text style={styles.hint}>
            An admin created a coordinator, driver, finance, or admin account for you and emailed a 6-digit
            activation code. Enter it here along with a password to finish setting up your account.
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

          <Text style={styles.label}>Activation code</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            placeholder="123456"
            placeholderTextColor={colors.textFainter}
            maxLength={6}
            style={styles.input}
          />

          <Text style={styles.label}>Choose a password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="At least 8 characters"
              placeholderTextColor={colors.textFainter}
              style={styles.inputStyle}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textFaint} />
            </Pressable>
          </View>
 
          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="Repeat your password"
              placeholderTextColor={colors.textFainter}
              style={styles.inputStyle}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
              <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} color={colors.textFaint} />
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton title="Activate Account" onPress={submit} loading={loading} style={{ marginTop: spacing.md }} />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already activated? </Text>
            <Link href="/(auth)/login" style={styles.loginLink}>Log in</Link>
          </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingHorizontal: 14,
  },
  inputStyle: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    fontFamily: fontFamily.regular,
  },
  eyeButton: {
    paddingLeft: 10,
    paddingVertical: 8,
  },
  error: { color: colors.red, fontFamily: fontFamily.medium, fontSize: 12.5, marginTop: 6 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg, marginBottom: spacing.xl },
  loginText: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint },
  loginLink: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.green },
});
