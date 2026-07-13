import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionLabel } from '@/components/SectionLabel';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { api, imageUrl } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';
import type { FarmerStats, HarvestLog } from '@/types';

export default function FarmerHomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [logs, setLogs] = useState<HarvestLog[]>([]);

  const load = useCallback(async () => {
    const [statsRes, logsRes] = await Promise.all([
      api.get<FarmerStats>('/farmer/stats'),
      api.get<HarvestLog[]>('/harvest-logs'),
    ]);
    setStats(statsRes);
    setLogs(logsRes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: TAB_BAR_CLEARANCE }}>
      <View style={styles.headerText}>
        <Text style={styles.greeting}>{t('goodMorning')}</Text>
        <Text style={styles.name}>{user?.name}</Text>
      </View>

      <View style={styles.hero}>
        <Image source={{ uri: imageUrl('/static/images/goldenfield.jpg') }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroText}>Molo, {user?.name?.split(' ')[0]} — your farm at a glance</Text>
        </View>
      </View>

      <View style={styles.collectionCard}>
        <Text style={styles.collectionLabel}>{t('nextCollection')}</Text>
        <Text style={styles.collectionValue}>{stats?.nextCollection ?? '—'}</Text>
        <View style={styles.coordRow}>
          <View style={styles.coordAvatar}>
            <Text style={styles.coordInitials}>
              {stats?.coordinatorName
                ?.split(' ')
                .map((p) => p[0])
                .join('') ?? ''}
            </Text>
          </View>
          <Text style={styles.coordName}>Coordinator: {stats?.coordinatorName}</Text>
        </View>
      </View>

      <Pressable style={styles.logButton} onPress={() => router.push('/(farmer)/log')}>
        <Text style={styles.logButtonText}>{t('logNewCrop')}</Text>
      </Pressable>

      <SectionLabel style={{ marginBottom: 10 }}>{t('myHarvestLog')}</SectionLabel>
      {logs.map((log) => (
        <View key={log.id} style={styles.logRow}>
          <Image source={{ uri: imageUrl(log.img) }} style={styles.logImage} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={styles.logName}>{log.cropName}</Text>
            <Text style={styles.logMeta}>{log.qtyKg} kg · logged {log.loggedAt}</Text>
          </View>
          {log.status === 'collected' ? (
            <StatusBadge label="Collected" bg={colors.greenBg} color={colors.green} />
          ) : (
            <StatusBadge label="Awaiting Collection" bg={colors.amberBg} color={colors.amber} />
          )}
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  headerText: { marginBottom: spacing.lg },
  greeting: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textFaint },
  name: { fontFamily: fontFamily.extraBold, fontSize: 19, color: colors.text },
  hero: { height: 120, borderRadius: radii.xxl, overflow: 'hidden', marginBottom: spacing.lg },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: 'rgba(0,0,0,0.2)' },
  heroText: { color: '#fff', fontFamily: fontFamily.extraBold, fontSize: 15 },
  collectionCard: { backgroundColor: colors.green, borderRadius: radii.xxl, padding: 18, marginBottom: spacing.lg },
  collectionLabel: { fontFamily: fontFamily.bold, fontSize: 11, color: '#D9E8CE', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  collectionValue: { fontFamily: fontFamily.extraBold, fontSize: 17, color: '#fff', marginBottom: 8 },
  coordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coordAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  coordInitials: { fontFamily: fontFamily.bold, fontSize: 11, color: '#fff' },
  coordName: { fontFamily: fontFamily.regular, fontSize: 12.5, color: '#EAF3E2' },
  logButton: { backgroundColor: colors.green, borderRadius: radii.xl, paddingVertical: 18, alignItems: 'center', marginBottom: spacing.xl },
  logButtonText: { fontFamily: fontFamily.extraBold, fontSize: 16, color: '#fff' },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  logImage: { width: 56, height: 56, borderRadius: radii.lg, backgroundColor: colors.surfaceAlt },
  logName: { fontFamily: fontFamily.bold, fontSize: 15, color: colors.text },
  logMeta: { fontFamily: fontFamily.regular, fontSize: 12.5, color: colors.textFaint },
});
