import { Redirect } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { fontFamily, spacing } from '@/constants/theme';

export default function Index() {
  const { user, isLoading, logout } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return <LoadingScreen backgroundColor={colors.bg} tintColor={colors.green} />;
  }

  if (!user) return <Redirect href="/(auth)/welcome" />;
  if (user.role === 'buyer') return <Redirect href="/(buyer)/market" />;
  if (user.role === 'farmer') return <Redirect href="/(farmer)/home" />;
  if (user.role === 'driver') return <Redirect href="/(driver)/deliveries" />;
  if (user.role === 'coordinator') return <Redirect href="/(coordinator)/overview" />;

  // Admin and finance are portal-only roles — there's no dedicated mobile
  // flow for them, so point them at the web portal instead of silently
  // dropping them into an unrelated tab set.
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Use the Mana Portal</Text>
      <Text style={[styles.body, { color: colors.textFaint }]}>
        {user.role === 'admin' ? 'Admin' : 'Finance'} accounts manage Mana from the web portal, not this app.
      </Text>
      <Text style={styles.link} onPress={logout}>
        Log out
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  title: { fontFamily: fontFamily.extraBold, fontSize: 18 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, textAlign: 'center' },
  link: { fontFamily: fontFamily.bold, fontSize: 14, color: '#2E7D32', marginTop: spacing.lg },
});
