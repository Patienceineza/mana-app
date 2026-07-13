import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';
import { fontFamily } from '@/constants/theme';
import { getUnreadCount } from '@/lib/notifications';
import { onNotificationsChanged } from '@/lib/notificationEvents';

const POLL_INTERVAL_MS = 30000;

// Floats over every authenticated screen rather than living in each role's
// own tab layout — one implementation point instead of five near-identical
// ones, since buyer/farmer/coordinator/driver each have their own header.
export function NotificationBell() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    getUnreadCount()
      .then((res) => setCount(res.unreadCount))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    const unsubscribe = onNotificationsChanged(refresh);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [refresh]);

  return (
    <Pressable
      onPress={() => router.push('/notifications')}
      style={[styles.button, { top: insets.top + 8, backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Ionicons name={count > 0 ? 'notifications' : 'notifications-outline'} size={19} color={colors.text} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.red }]}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 50,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: fontFamily.bold,
  },
});
