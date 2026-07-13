import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/FloatingTabBar';
import { TabIcon } from '@/components/TabIcon';
import { CartProvider, useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

function BuyerTabs() {
  const { count } = useCart();
  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="market"
        options={{ title: 'Market', tabBarAccessibilityLabel: 'Market', tabBarIcon: ({ color, focused }) => <TabIcon outline="storefront-outline" filled="storefront" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="route"
        options={{
          title: 'Route',
          tabBarAccessibilityLabel: 'Route',
          tabBarIcon: ({ color, focused }) => <TabIcon outline="cart-outline" filled="cart" color={color} focused={focused} />,
          tabBarBadge: count > 0 ? count : undefined,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{ title: 'Track', tabBarAccessibilityLabel: 'Track', tabBarIcon: ({ color, focused }) => <TabIcon outline="location-outline" filled="location" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarAccessibilityLabel: 'Profile', tabBarIcon: ({ color, focused }) => <TabIcon outline="person-circle-outline" filled="person-circle" color={color} focused={focused} size={23} /> }}
      />
      <Tabs.Screen
        name="request-product"
        options={{
          href: null,
          title: 'Request Product',
        }}
      />
    </Tabs>
  );
}

export default function BuyerLayout() {
  const { user, isLoading } = useAuth();
  if (!isLoading && (!user || user.role !== 'buyer')) return <Redirect href="/" />;

  return (
    <CartProvider>
      <BuyerTabs />
    </CartProvider>
  );
}
