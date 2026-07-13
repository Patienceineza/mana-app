import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';
import { fontFamily, radii, spacing, ThemeColors } from '@/constants/theme';
import { listNotifications, markAllNotificationsRead, markNotificationRead, Notification } from '@/lib/notifications';
import { emitNotificationsChanged } from '@/lib/notificationEvents';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await listNotifications(1);
      setItems(res.items);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const onPressItem = async (n: Notification) => {
    if (n.read) return;
    setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)));
    try {
      await markNotificationRead(n.id);
    } catch {
      // best-effort — local state already reflects "read"
    } finally {
      emitNotificationsChanged();
    }
  };

  const onMarkAllRead = async () => {
    setItems((prev) => prev.map((it) => ({ ...it, read: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // best-effort
    } finally {
      emitNotificationsChanged();
    }
  };

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={onMarkAllRead}>
            <Text style={styles.markAllLink}>Mark all read</Text>
          </Pressable>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>You're all caught up.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => onPressItem(item)} style={[styles.item, !item.read && styles.itemUnread]}>
            {!item.read && <View style={styles.dot} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.body ? <Text style={styles.itemBody}>{item.body}</Text> : null}
              <Text style={styles.itemTime}>{formatRelativeTime(item.createdAt)}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backLink: { fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.green, width: 60 },
    title: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.text },
    markAllLink: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.green, width: 80, textAlign: 'right' },
    list: { padding: spacing.lg, flexGrow: 1 },
    item: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.lg,
      marginBottom: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemUnread: { backgroundColor: colors.greenBg, borderColor: colors.green },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green, marginTop: 6 },
    itemTitle: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text, marginBottom: 2 },
    itemBody: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint, marginBottom: 4 },
    itemTime: { fontFamily: fontFamily.medium, fontSize: 11, color: colors.textFainter },
    empty: { paddingTop: spacing.xxl * 2, alignItems: 'center' },
    emptyText: { fontFamily: fontFamily.medium, fontSize: 13, color: colors.textFaint },
  });
