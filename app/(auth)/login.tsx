import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Wordmark } from '@/components/Wordmark';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useGoogleIdToken } from '@/lib/googleAuth';
import { ApiError } from '@/lib/api';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';
import { googleIconBase64 } from '@/constants/googleIcon';

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors, isDark);

  const [request, response, promptAsync] = useGoogleIdToken();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response?.type === 'success' && response.params.id_token) {
      setGoogleLoading(true);
      setError(null);
      loginWithGoogle(response.params.id_token)
        .then(() => router.replace('/'))
        .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not sign in with Google.'))
        .finally(() => setGoogleLoading(false));
    } else if (response?.type === 'error') {
      setError('Google sign-in was cancelled or failed.');
    }
  }, [response, loginWithGoogle]);

  const submitEmailLogin = async () => {
    if (!identifier || !password) {
      setError('Email or phone number, and password, are required.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(identifier, password);
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in. Please try again.');
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
            <Text style={styles.tagline}>Farm-to-business produce network</Text>
          </View>

          {/* Direct Email/Password Login Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="default"
              placeholder="you@example.com or +254712345678"
              placeholderTextColor={colors.textFainter}
              style={styles.input}
            />
            
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textFainter}
                style={styles.inputStyle}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textFaint} />
              </Pressable>
            </View>
            
            {error ? <Text style={styles.error}>{error}</Text> : null}
            
            <PrimaryButton title="Log In" onPress={submitEmailLogin} loading={loading} style={{ marginTop: spacing.md }} />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <View style={styles.googleContainer}>
            <Pressable
              disabled={!request || googleLoading}
              onPress={() => promptAsync()}
              style={[styles.googleButton, (!request || googleLoading) && { opacity: 0.6 }]}
            >
              {googleLoading ? (
                <ActivityIndicator color="#1C1C1E" />
              ) : (
                <View style={styles.googleButtonContent}>
                  <Image source={{ uri: googleIconBase64 }} style={styles.googleIcon} resizeMode="contain" />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </View>
              )}
            </Pressable>
            <Text style={styles.googleHint}>For buyers — creates your account automatically the first time.</Text>
          </View>

          {/* Navigation/Footer Links */}
          <View style={styles.footerRow}>
            <View style={styles.linkItem}>
              <Text style={styles.footerText}>New to Mana? </Text>
              <Link href="/(auth)/register" style={styles.footerLink}>Create account</Link>
            </View>
            <View style={styles.linkItem}>
              <Text style={styles.footerText}>Staff activation? </Text>
              <Link href="/(auth)/activate" style={styles.footerLink}>Activate code</Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center', gap: spacing.md },
  header: { alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  tagline: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint },
  form: { gap: spacing.xs, width: '100%' },
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
  error: { color: colors.red, fontFamily: fontFamily.medium, fontSize: 12.5, marginTop: spacing.sm, textAlign: 'center' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderLight },
  dividerText: { fontFamily: fontFamily.medium, fontSize: 12, color: colors.textFainter, paddingHorizontal: spacing.md },
  googleContainer: { gap: spacing.sm },
  googleButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  googleButtonText: { fontFamily: fontFamily.bold, fontSize: 14, color: '#1C1C1E' },
  googleHint: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.textFainter, textAlign: 'center' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg, paddingHorizontal: spacing.xs },
  linkItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textFaint },
  footerLink: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.green },
});
