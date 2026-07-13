import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountSettings } from '@/components/AccountSettings';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { fontFamily, spacing, TAB_BAR_CLEARANCE } from '@/constants/theme';

export default function DriverSettingsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: TAB_BAR_CLEARANCE }}>
        <Text style={styles.title}>{t('settings')}</Text>
        <AccountSettings />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: import('@/constants/theme').ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    title: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.text, marginBottom: spacing.lg },
  });
