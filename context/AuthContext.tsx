import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { getBiometricLockEnabled, isBiometricAvailable } from '@/lib/biometrics';
import { api, ApiError, clearToken, getToken, setToken as persistToken } from '@/lib/api';
import { registerDeviceToken, unregisterDeviceToken } from '@/lib/notifications';
import { getDevicePushToken } from '@/lib/push';
import type { AuthResponse, User } from '@/types';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName?: string;
  address?: string;
}

interface UpdateProfileInput {
  name?: string;
  phone?: string;
  businessName?: string;
  address?: string;
  farmName?: string;
  region?: string;
  vehicleLabel?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  locked: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  activateAccount: (email: string, code: string, password: string) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  unlock: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const pushTokenRef = useRef<string | null>(null);

  const hydrateUser = useCallback(async () => {
    try {
      const me = await api.get<User>('/auth/me');
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError) await clearToken();
    }
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        const lockEnabled = await getBiometricLockEnabled();
        const canUseBiometrics = lockEnabled && (await isBiometricAvailable());
        if (canUseBiometrics) {
          // Defer hydrating the session until the user passes the biometric
          // gate — see unlock() below.
          setLocked(true);
        } else {
          await hydrateUser();
        }
      }
      setIsLoading(false);
    })();
  }, [hydrateUser]);

  // Register this device for push once a user is signed in. Best-effort:
  // fails silently on simulators, web, denied permission, or if Firebase
  // isn't natively linked yet — in-app notifications work regardless.
  useEffect(() => {
    if (!user) return;
    (async () => {
      const device = await getDevicePushToken();
      if (!device) return;
      pushTokenRef.current = device.token;
      try {
        await registerDeviceToken(device.token, device.platform);
      } catch {
        // best-effort
      }
    })();
  }, [user?.id]);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { identifier, password });
    await persistToken(res.token);
    setUser(res.user);
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const res = await api.post<AuthResponse>('/auth/google', { idToken });
    await persistToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const res = await api.post<AuthResponse>('/auth/register', input);
    await persistToken(res.token);
    setUser(res.user);
  }, []);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const updated = await api.post<User>('/auth/verify-email', { email, code });
    setUser(updated);
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    await api.post('/auth/resend-verification', { email });
  }, []);

  const activateAccount = useCallback(async (email: string, code: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/activate', { email, code, password });
    await persistToken(res.token);
    setUser(res.user);
  }, []);

  const updateProfile = useCallback(async (input: UpdateProfileInput) => {
    const updated = await api.patch<User>('/profile', input);
    setUser(updated);
  }, []);

  const unlock = useCallback(() => {
    setLocked(false);
    hydrateUser();
  }, [hydrateUser]);

  const logout = useCallback(async () => {
    if (pushTokenRef.current) {
      try {
        await unregisterDeviceToken(pushTokenRef.current);
      } catch {
        // best-effort
      }
      pushTokenRef.current = null;
    }
    await clearToken();
    setUser(null);
    setLocked(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      locked,
      login,
      loginWithGoogle,
      register,
      verifyEmail,
      resendVerification,
      activateAccount,
      updateProfile,
      unlock,
      logout,
    }),
    [
      user,
      isLoading,
      locked,
      login,
      loginWithGoogle,
      register,
      verifyEmail,
      resendVerification,
      activateAccount,
      updateProfile,
      unlock,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
