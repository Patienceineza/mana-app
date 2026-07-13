import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Avatar } from './Avatar';
import { SectionLabel } from './SectionLabel';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ThemePreference, useTheme } from '@/context/ThemeContext';
import {
  authenticateWithBiometrics,
  biometricLabel,
  getBiometricLockEnabled,
  isBiometricAvailable,
  setBiometricLockEnabled,
} from '@/lib/biometrics';
import { LANGUAGES } from '@/lib/i18n';
import { fontFamily, radii, spacing } from '@/constants/theme';

const THEME_OPTIONS: { key: ThemePreference; labelKey: 'light' | 'dark' | 'system' }[] = [
  { key: 'light', labelKey: 'light' },
  { key: 'dark', labelKey: 'dark' },
  { key: 'system', labelKey: 'system' },
];

export function AccountSettings() {
  const { user, logout } = useAuth();
  const { colors, preference, setPreference } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const styles = makeStyles(colors);

  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricLabelText, setBiometricLabelText] = useState('Biometric Unlock');
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [biometricBusy, setBiometricBusy] = useState(false);
  const [biometricError, setBiometricError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [available, enabled, label] = await Promise.all([
        isBiometricAvailable(),
        getBiometricLockEnabled(),
        biometricLabel(),
      ]);
      setBiometricSupported(available);
      setBiometricEnabledState(enabled);
      setBiometricLabelText(label);
    })();
  }, []);

  const toggleBiometricLock = async (next: boolean) => {
    setBiometricError(null);
    setBiometricBusy(true);
    try {
      if (next) {
        const success = await authenticateWithBiometrics(`Enable ${biometricLabelText} to unlock Mana`);
        if (!success) {
          setBiometricError('Could not verify your identity. Lock was not enabled.');
          return;
        }
      }
      await setBiometricLockEnabled(next);
      setBiometricEnabledState(next);
    } finally {
      setBiometricBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ gap: spacing.xl }}>
      <View>
        <SectionLabel style={{ marginBottom: 10 }}>{t('account')}</SectionLabel>
        <View style={styles.card}>
          <Avatar name={user?.name ?? '?'} size={44} />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{t(user?.role ?? 'buyer')}</Text>
          </View>
        </View>
        <Pressable onPress={() => router.push('/edit-profile')} style={styles.editLink}>
          <Text style={styles.editLinkText}>Edit profile</Text>
        </Pressable>
      </View>

      {biometricSupported && (
        <View>
          <SectionLabel style={{ marginBottom: 10 }}>Security</SectionLabel>
          <View style={styles.securityRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.securityLabel}>Unlock with {biometricLabelText}</Text>
              <Text style={styles.securitySubtext}>Require {biometricLabelText} to open the app.</Text>
            </View>
            {biometricBusy ? (
              <ActivityIndicator color={colors.green} />
            ) : (
              <Switch
                value={biometricEnabled}
                onValueChange={toggleBiometricLock}
                trackColor={{ true: colors.green }}
              />
            )}
          </View>
          {biometricError ? <Text style={styles.securityError}>{biometricError}</Text> : null}
        </View>
      )}

      <View>
        <SectionLabel style={{ marginBottom: 10 }}>{t('appearance')}</SectionLabel>
        <View style={styles.segmentRow}>
          {THEME_OPTIONS.map((opt) => {
            const active = preference === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setPreference(opt.key)}
                style={[styles.segmentButton, active && styles.segmentButtonActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{t(opt.labelKey)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View>
        <SectionLabel style={{ marginBottom: 10 }}>{t('language')}</SectionLabel>
        <View style={styles.segmentRow}>
          {LANGUAGES.map((l) => {
            const active = language === l.key;
            return (
              <Pressable
                key={l.key}
                onPress={() => setLanguage(l.key)}
                style={[styles.segmentButton, active && styles.segmentButtonActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{l.nativeLabel}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>{t('logOut')}</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (colors: import('@/constants/theme').ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radii.lg,
      padding: 14,
    },
    userName: { fontFamily: fontFamily.bold, fontSize: 14.5, color: colors.text },
    userEmail: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.textFaint },
    roleBadge: { backgroundColor: colors.greenBg, borderRadius: radii.sm, paddingVertical: 4, paddingHorizontal: 8 },
    roleBadgeText: { fontFamily: fontFamily.bold, fontSize: 10.5, color: colors.green },
    editLink: { alignItems: 'center', paddingVertical: 10, marginTop: 4 },
    editLinkText: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.green },
    securityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radii.lg,
      padding: 14,
    },
    securityLabel: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.text, marginBottom: 2 },
    securitySubtext: { fontFamily: fontFamily.regular, fontSize: 11.5, color: colors.textFaint },
    securityError: { fontFamily: fontFamily.medium, fontSize: 11.5, color: colors.red, marginTop: 6 },
    segmentRow: { flexDirection: 'row', gap: 8 },
    segmentButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.md,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    segmentButtonActive: { backgroundColor: colors.green, borderColor: colors.green },
    segmentText: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textFaint },
    segmentTextActive: { color: '#fff' },
    logoutButton: { alignItems: 'center', paddingVertical: 12 },
    logoutText: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.red },
  });
