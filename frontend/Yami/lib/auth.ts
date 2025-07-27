// created 7/22/2025 by Moses Lytle

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// For testing on device, you may need to replace 'localhost' with your computer's IP
// Example: 'http://192.168.1.100:3000/api/v1'
let API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'  // Development (web/simulator)
  : 'http://localhost:3000/api/v1';  // Production

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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

class AuthService {
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  async removeToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0] || 'Login failed');
    }

    if (data.token) {
      await this.setToken(data.token);
    }

    return data;
  }

  async register(userData: RegisterData): Promise<{ message: string }> {
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
  }

  async logout() {
    await this.removeToken();
  }

  async getCurrentUser(): Promise<User | null> {
    const token = await this.getToken();
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
          await this.removeToken();
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;

    // TODO: Optionally validate token with backend
    return true;
  }
}

export const authService = new AuthService();
