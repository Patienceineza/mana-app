import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Buyers sign up/sign in with Google — these are the app's OAuth client IDs
// for each platform (all three should be registered under the same Google
// Cloud project). Leave any of these blank if that platform build isn't
// configured yet; the hook still works for the platforms that are.
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined;

export function useGoogleIdToken() {
  return Google.useIdTokenAuthRequest({
    webClientId,
    iosClientId,
    androidClientId,
  });
}
