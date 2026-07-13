import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/FloatingTabBar';
import { TabIcon } from '@/components/TabIcon';
import { useAuth } from '@/context/AuthContext';

export default function DriverLayout() {
  const { user, isLoading } = useAuth();
  if (!isLoading && (!user || user.role !== 'driver')) return <Redirect href="/" />;

  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
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
