// Created 07/20/2025 by Linus Xiong
// Updated 07/27/2025 by Joshua Zhang - Change the axios interceptor to less aggressive to prevent unintentionally logout for 401.
import axios from 'axios';
import { useAuthStore } from '../store/auth-store';
import { API_ORIGIN } from './api-config';

const apiClient = axios.create({
  baseURL: API_ORIGIN,
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
    // Only logout on 401 if a protected endpoint and not login
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't logout for login/register endpoints
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        const { logout } = useAuthStore.getState();
        await logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
