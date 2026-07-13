import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/FloatingTabBar';
import { TabIcon } from '@/components/TabIcon';
import { useAuth } from '@/context/AuthContext';

export default function FarmerLayout() {
  const { user, isLoading } = useAuth();
  if (!isLoading && (!user || user.role !== 'farmer')) return <Redirect href="/" />;

  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarAccessibilityLabel: 'Home', tabBarIcon: ({ color, focused }) => <TabIcon outline="home-outline" filled="home" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: 'Log Crop', tabBarAccessibilityLabel: 'Log Crop', tabBarIcon: ({ color, focused }) => <TabIcon outline="add-circle-outline" filled="add-circle" color={color} focused={focused} size={23} /> }}
      />
      <Tabs.Screen
        name="prices"
        options={{ title: 'Prices', tabBarAccessibilityLabel: 'Prices', tabBarIcon: ({ color, focused }) => <TabIcon outline="pricetag-outline" filled="pricetag" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="listings"
        options={{ title: 'My Listings', tabBarAccessibilityLabel: 'My Listings', tabBarIcon: ({ color, focused }) => <TabIcon outline="storefront-outline" filled="storefront" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="earnings"
        options={{ title: 'Earnings', tabBarAccessibilityLabel: 'Earnings', tabBarIcon: ({ color, focused }) => <TabIcon outline="wallet-outline" filled="wallet" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarAccessibilityLabel: 'Settings', tabBarIcon: ({ color, focused }) => <TabIcon outline="settings-outline" filled="settings" color={color} focused={focused} /> }}
      />
    </Tabs>
  );
}
