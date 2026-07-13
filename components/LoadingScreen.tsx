import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

interface LoadingScreenProps {
  backgroundColor: string;
  tintColor: string;
}

/** Full-screen loading state showing the Mana icon, used anywhere the app is
 * waiting on auth/fonts/data before it has a real screen to show. */
export function LoadingScreen({ backgroundColor, tintColor }: LoadingScreenProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image source={require('@/assets/icon.png')} style={styles.icon} resizeMode="contain" />
      <ActivityIndicator color={tintColor} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 88, height: 88, borderRadius: 20, marginBottom: 20 },
  spinner: {},
});
