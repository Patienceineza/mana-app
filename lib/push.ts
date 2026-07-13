import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Show alerts while the app is foregrounded (Expo defaults to silent
// delivery in the foreground otherwise).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export interface DevicePushToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
}

// Requests notification permission and returns the raw native device push
// token (an FCM registration token on Android, an APNs token on iOS) — this
// is the token the backend's Firebase Cloud Messaging client sends to
// directly, not an Expo-relay token. Returns null on simulators/emulators,
// web, or if permission is denied, so callers can just skip registration.
export async function getDevicePushToken(): Promise<DevicePushToken | null> {
  if (Platform.OS === 'web') return null;
  if (!Device.isDevice) return null; // push tokens aren't available on simulators/emulators

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  try {
    const { data } = await Notifications.getDevicePushTokenAsync();
    return { token: data, platform: Platform.OS as 'ios' | 'android' };
  } catch {
    // Most commonly: Firebase isn't linked natively yet (no
    // google-services.json / APNs bridging configured) — fail silently,
    // in-app notifications still work without push.
    return null;
  }
}
