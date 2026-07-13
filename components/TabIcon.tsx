import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface TabIconProps {
  outline: keyof typeof Ionicons.glyphMap;
  filled: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  size?: number;
}

export function TabIcon({ outline, filled, color, focused, size = 21 }: TabIconProps) {
  return <Ionicons name={focused ? filled : outline} size={size} color={color} />;
}
