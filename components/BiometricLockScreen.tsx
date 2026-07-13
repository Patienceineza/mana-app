import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Wordmark } from '@/components/Wordmark';
import { authenticateWithBiometrics, biometricLabel } from '@/lib/biometrics';
import { fontFamily, spacing, ThemeColors } from '@/constants/theme';

interface BiometricLockScreenProps {
  colors: ThemeColors;
  onUnlock: () => void;
}

export function BiometricLockScreen({ colors, onUnlock }: BiometricLockScreenProps) {
  const styles = makeStyles(colors);
  const [label, setLabel] = useState('Biometric Unlock');
  const [error, setError] = useState<string | null>(null);
  const [attempting, setAttempting] = useState(false);

  useEffect(() => {
    biometricLabel().then(setLabel);
  }, []);

  const attempt = useCallback(async () => {
    setAttempting(true);
    setError(null);
    try {
      const success = await authenticateWithBiometrics(`Unlock Mana with ${label}`);
      if (success) {
        onUnlock();
      } else {
        setError('Authentication was not successful. Try again.');
      }
    } finally {
      setAttempting(false);
    }
  }, [label, onUnlock]);

  useEffect(() => {
    attempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Wordmark />
      <Text style={styles.title}>App Locked</Text>
      <Text style={styles.subtitle}>Unlock with {label} to continue.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton title={`Unlock with ${label}`} onPress={attempt} loading={attempting} style={{ marginTop: spacing.xl }} />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
    title: { fontFamily: fontFamily.extraBold, fontSize: 20, color: colors.text, marginTop: spacing.lg },
    subtitle: { fontFamily: fontFamily.regular, fontSize: 13.5, color: colors.textFaint, textAlign: 'center' },
    error: { fontFamily: fontFamily.medium, fontSize: 12.5, color: colors.red, textAlign: 'center', marginTop: spacing.sm },
  });
