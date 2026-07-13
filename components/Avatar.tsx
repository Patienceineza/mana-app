import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/constants/theme';

// A simple generated avatar: initials on a color picked deterministically
// from the name, so every user gets a distinct but stable look with no
// photo upload required.
const PALETTE = ['#2E7D32', '#1565C0', '#8E24AA', '#D84315', '#00838F', '#6D4C41', '#AD1457', '#37474F', '#F9A825', '#5E35B1'];

function hashColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0]!.toUpperCase();
  return (parts[0][0]! + parts[parts.length - 1][0]!).toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 44 }: AvatarProps) {
  const bg = hashColor(name || '?');
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontFamily: fontFamily.bold },
});
