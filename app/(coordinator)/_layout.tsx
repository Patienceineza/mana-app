import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/FloatingTabBar';
import { TabIcon } from '@/components/TabIcon';
import { useAuth } from '@/context/AuthContext';

export default function CoordinatorLayout() {
  const { user, isLoading } = useAuth();
  if (!isLoading && (!user || user.role !== 'coordinator')) return <Redirect href="/" />;

  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="overview"
        options={{ title: 'Overview', tabBarAccessibilityLabel: 'Overview', tabBarIcon: ({ color, focused }) => <TabIcon outline="grid-outline" filled="grid" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="inspections"
        options={{ title: 'Inspections', tabBarAccessibilityLabel: 'Inspections', tabBarIcon: ({ color, focused }) => <TabIcon outline="clipboard-outline" filled="clipboard" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="route"
        options={{ title: 'Route', tabBarAccessibilityLabel: 'Route', tabBarIcon: ({ color, focused }) => <TabIcon outline="map-outline" filled="map" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="deliveries"
        options={{ title: 'Deliveries', tabBarAccessibilityLabel: 'Deliveries', tabBarIcon: ({ color, focused }) => <TabIcon outline="car-outline" filled="car" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarAccessibilityLabel: 'Settings', tabBarIcon: ({ color, focused }) => <TabIcon outline="settings-outline" filled="settings" color={color} focused={focused} /> }}
      />
    </Tabs>
  );
}
