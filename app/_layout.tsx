import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';

import { BiometricLockScreen } from '@/components/BiometricLockScreen';
import { LoadingScreen } from '@/components/LoadingScreen';
import { NotificationBell } from '@/components/NotificationBell';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { lightColors, ThemeColors } from '@/constants/theme';

function AppNavigator({ colors }: { colors: ThemeColors }) {
  const { locked, unlock, user } = useAuth();

  if (locked) {
    return <BiometricLockScreen colors={colors} onUnlock={unlock} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(buyer)" />
        <Stack.Screen name="(farmer)" />
        <Stack.Screen name="(coordinator)" />
        <Stack.Screen name="(driver)" />
      </Stack>
      {user && <NotificationBell />}
    </View>
  );
}

function ThemedShell() {
  const { colors, isDark } = useTheme();
  return (
    <AuthProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator colors={colors} />
    </AuthProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <LoadingScreen backgroundColor={lightColors.bg} tintColor={lightColors.green} />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ThemedShell />
      </LanguageProvider>
    </ThemeProvider>
  );
}
