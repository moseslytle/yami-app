// Created 07/20/2025 By Linus Xiong
// Updated 07/22/2025 By Linus Xiong - Enhanced with user management and additional auth methods

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { create } from 'zustand';

// API configuration
let API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'
  : 'http://localhost:3000/api/v1';

const { expoGoConfig } = Constants;
const debuggerHost = expoGoConfig?.debuggerHost;

if (debuggerHost) {
  const ip = debuggerHost.split(':')[0];
  API_BASE_URL = `http://${ip}:3000/api/v1`;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_verified: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (token: string, user?: User) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ message: string }>;
  getCurrentUser: () => Promise<User | null>;
  updateUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  login: async (token: string, user?: User) => {
    try {
      await AsyncStorage.setItem('jwt_token', token);
      set({ 
        token, 
        isAuthenticated: true, 
        user: user || null,
        isLoading: false 
      });
      
      // If no user data provided, fetch it
      if (!user) {
        get().getCurrentUser();
      }
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      set({ 
        token: null, 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },
  
  register: async (userData: RegisterData): Promise<{ message: string }> => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.join(', ') || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    const { token } = get();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, logout
          get().logout();
        }
        return null;
      }

      const user = await response.json();
      set({ user });
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  
  updateUser: (user: User) => {
    set({ user });
  },
  
  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        set({ token, isAuthenticated: true });
        // Fetch user data
        await get().getCurrentUser();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));