// Created 07/20/2025 By Linus Xiong
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isAuthenticated: false,
  
  login: async (token: string) => {
    await AsyncStorage.setItem('jwt_token', token);
    set({ token, isAuthenticated: true });
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('jwt_token');
    set({ token: null, isAuthenticated: false });
  },
  
  initializeAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        set({ token, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },
}));