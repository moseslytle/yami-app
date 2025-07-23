// Created 07/20/2025 by Linus Xiong
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/auth-store';

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://127.0.0.1:3000';
    } else {
      const { expoGoConfig } = Constants;
      const debuggerHost = expoGoConfig?.debuggerHost;
      
      if (debuggerHost) {
        const ip = debuggerHost.split(':')[0];
        return `http://${ip}:3000`;
      }
      
      return 'http://192.168.1.100:3000';
    }
  }
  return 'http://127.0.0.1:3000';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const { token } = useAuthStore.getState();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      await logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;