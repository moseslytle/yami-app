import Constants from 'expo-constants';
import { Platform } from 'react-native';

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');

const getDevelopmentUrl = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && !__DEV__) {
      return window.location.origin;
    }

    return 'http://127.0.0.1:3000';
  }

  const debuggerHost = Constants.expoGoConfig?.debuggerHost;
  const host = debuggerHost?.split(':')[0] || '127.0.0.1';
  return `http://${host}:3000`;
};

export const API_ORIGIN = configuredUrl || getDevelopmentUrl();
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
