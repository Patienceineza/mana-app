import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeContext';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';

export default function WelcomeScreen() {
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      {/* Premium Ambient Concentric Background Glows */}
      <View style={styles.glowGreenOuter} />
      <View style={styles.glowGreenMiddle} />
      <View style={styles.glowGreenInner} />

      <SafeAreaView style={styles.safe}>
        {/* Top Header Row */}
        <View style={styles.header}>
          <Image source={require('@/assets/icon.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.spacer} />

        {/* Content Area */}
        <View style={styles.content}>
          <Text style={styles.headline}>
            Easy for Beginners,{"\n"}Powerful for All
          </Text>

          <View style={styles.subRow}>
            <View style={styles.arrowContainer}>
              <Feather name="arrow-up-right" size={18} color={colors.text} />
            </View>
            <Text style={styles.subtitle}>
              Effortless Sourcing for Everyone: Discover How Simple Steps Can Make Fresh Supply Easy
            </Text>
          </View>

          {/* Line Separator */}
          <View style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>LOG IN</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/(auth)/register')}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const makeStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    safe: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      justifyContent: 'space-between',
    },
    glowGreenOuter: {
      position: 'absolute',
      top: 100,
      left: -200,
      width: 500,
      height: 500,
      borderRadius: 250,
      backgroundColor: colors.green,
      opacity: isDark ? 0.03 : 0.015,
    },
    glowGreenMiddle: {
      position: 'absolute',
      top: 175,
      left: -125,
      width: 350,
      height: 350,
      borderRadius: 175,
      backgroundColor: colors.green,
      opacity: isDark ? 0.06 : 0.03,
    },
    glowGreenInner: {
      position: 'absolute',
      top: 250,
      left: -50,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.green,
      opacity: isDark ? 0.12 : 0.05,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      marginTop: spacing.sm,
    },
    logo: {
      width: 36,
      height: 36,
      borderRadius: radii.md,
    },
    spacer: {
      flex: 1,
    },
    content: {
      paddingBottom: spacing.xl,
    },
    headline: {
      fontFamily: fontFamily.extraBold,
      fontSize: 38,
      lineHeight: 46,
      color: colors.text,
      marginBottom: spacing.lg,
    },
    subRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: spacing.xl,
      paddingRight: spacing.md,
    },
    arrowContainer: {
      marginTop: 3,
    },
    subtitle: {
      fontFamily: fontFamily.regular,
      fontSize: 14,
      lineHeight: 22,
      color: colors.textFaint,
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      opacity: 0.15,
      marginBottom: spacing.xl,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: Platform.OS === 'ios' ? spacing.sm : spacing.md,
    },
    loginButton: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)',
      borderRadius: radii.xl,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    loginButtonText: {
      fontFamily: fontFamily.bold,
      fontSize: 12.5,
      color: colors.text,
      letterSpacing: 0.8,
    },
    registerButton: {
      flex: 1,
      backgroundColor: colors.green,
      borderRadius: radii.xl,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.green,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    registerButtonText: {
      fontFamily: fontFamily.bold,
      fontSize: 12.5,
      color: '#FFFFFF',
      letterSpacing: 0.8,
    },
  });
