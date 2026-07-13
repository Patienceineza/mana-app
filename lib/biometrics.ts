import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

import { getItem, setItem, deleteItem } from './storage';

const LOCK_ENABLED_KEY = 'mana_biometric_lock_enabled';

/** Whether this device has biometric hardware AND has at least one biometric enrolled. */
export async function isBiometricAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return isEnrolled;
}

/** A human label for whichever biometric type this device actually supports. */
export async function biometricLabel(): Promise<string> {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return Platform.OS === 'ios' ? 'Face ID' : 'Face Unlock';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
  }
  return 'Biometric Unlock';
}

export async function authenticateWithBiometrics(promptMessage: string): Promise<boolean> {
  const res = await LocalAuthentication.authenticateAsync({
    promptMessage,
    disableDeviceFallback: false,
    cancelLabel: 'Cancel',
  });
  return res.success;
}

export async function getBiometricLockEnabled(): Promise<boolean> {
  const v = await getItem(LOCK_ENABLED_KEY);
  return v === '1';
}

export async function setBiometricLockEnabled(enabled: boolean): Promise<void> {
  if (enabled) {
    await setItem(LOCK_ENABLED_KEY, '1');
  } else {
    await deleteItem(LOCK_ENABLED_KEY);
  }
}
