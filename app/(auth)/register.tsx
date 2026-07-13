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
import { isValidPhone } from '@/lib/validation';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || password.length < 8) {
      setError('Name, email, and a password of at least 8 characters are required.');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Enter a valid phone number with country code, e.g. +254712345678.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register({ name, email, password, phone, businessName, address });
      router.replace({ pathname: '/(auth)/verify-email', params: { email } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create account. Please try again.');
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
            <Text style={styles.tagline}>Create your buyer account</Text>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.textFainter} style={styles.input} />

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

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholder="+254712345678"
            placeholderTextColor={colors.textFainter}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
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
 
          <Text style={styles.label}>Confirm Password</Text>
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

          <Text style={styles.label}>Business Name (optional)</Text>
          <TextInput
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="e.g. Kwa-Anele Bistro"
            placeholderTextColor={colors.textFainter}
            style={styles.input}
          />

          <Text style={styles.label}>Delivery Address (optional)</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Street, suburb, city"
            placeholderTextColor={colors.textFainter}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton title="Create Account" onPress={submit} loading={loading} style={{ marginTop: spacing.md }} />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/(auth)/login" style={styles.loginLink}>Log in</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, padding: spacing.xl, gap: spacing.xs },
  header: { alignItems: 'center', gap: 6, marginBottom: spacing.lg },
  tagline: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint },
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
