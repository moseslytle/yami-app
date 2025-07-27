// created 7/22/2025 by Moses Lytle
// updated 7/22/2025 by Moses Lytle - Refactored login screen to support user flow and add logo
// updated 7/22/2025 By Linus Xiong - Refactored to use useAuthStore instead of authService

import { Eye, EyeOff } from '@tamagui/lucide-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, useColorScheme, View } from 'react-native';
import { Button, H2, Input, Paragraph, XStack, YStack } from 'tamagui';
import { AdvancedYamiLogo } from '../components/AdvancedYamiLogo';
import { FloatingBackButton } from '../components/FloatingBackButton';
import { useAuthStore } from '../store/auth-store';

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

export interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { login } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors?.[0] || 'Login failed');
            }

            if (data.token) {
                await login(data.token);
                // Navigate to main app
                router.replace('/');
            }
        } catch (error: any) {
            Alert.alert('Login Failed', error?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        router.push('/register');
    };

    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: colorScheme === 'dark' ? '#111111' : '#FFFFFF' 
        }}>
            <FloatingBackButton />
            <YStack
                flex={1}
                padding="$4"
                justifyContent="center"
                space="$4"
                maxWidth={400}
                alignSelf="center"
                width="100%"
            >
                {/* Animated Yami Logo */}
                <YStack alignItems="center" marginBottom="$4">
                    <AdvancedYamiLogo
                        size={100}
                        primaryColor="#2563eb"
                        secondaryColor="#7c3aed"
                    />
                </YStack>

                <YStack space="$2" alignItems="center">
                    <H2 color="$color12">Welcome Back</H2>
                    <Paragraph color="$color11" textAlign="center">
                        Sign in to your Yami account
                    </Paragraph>
                </YStack>

                <YStack space="$3">
                    <XStack alignItems="center" space="$2">
                        <Input
                            flex={1}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            size="$4"
                            borderColor="$borderColor"
                            focusStyle={{ borderColor: "$brand" }}
                            backgroundColor="$background"
                            color="$color12"
                            placeholderTextColor="$color9"
                        />
                    </XStack>

                    <XStack alignItems="center" space="$2">
                        <Input
                            flex={1}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoComplete="password"
                            size="$4"
                            borderColor="$borderColor"
                            focusStyle={{ borderColor: "$brand" }}
                            backgroundColor="$background"
                            color="$color12"
                            placeholderTextColor="$color9"
                        />
                        <Button
                            size="$3"
                            variant="outlined"
                            icon={showPassword ? EyeOff : Eye}
                            onPress={() => setShowPassword(!showPassword)}
                            borderColor="$borderColor"
                            borderWidth={1}
                            backgroundColor="$background"
                            color="$color11"
                            pressStyle={{ backgroundColor: "$color3" }}
                        />
                    </XStack>
                </YStack>

                <YStack space="$3">
                    <Button
                        backgroundColor="$brand"
                        color="white"
                        size="$4"
                        onPress={handleLogin}
                        disabled={isLoading}
                        pressStyle={{ backgroundColor: "$brandPress" }}
                        fontWeight="600"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Button
                        variant="outlined"
                        size="$4"
                        onPress={navigateToRegister}
                        borderColor="$brand"
                        borderWidth={1}
                        color="$brand"
                        backgroundColor="$background"
                        pressStyle={{ backgroundColor: "$color3" }}
                    >
                        Create Account
                    </Button>
                </YStack>

                <XStack justifyContent="center" space="$2" alignItems="center">
                    <Paragraph color="$color11" size="$3">
                        Forgot your password?
                    </Paragraph>
                    <Button 
                        variant="outlined" 
                        size="$3"
                        backgroundColor="transparent"
                        borderColor="transparent"
                        color="$brand"
                        pressStyle={{ backgroundColor: "$color3" }}
                    >
                        Reset
                    </Button>
                </XStack>
            </YStack>
        </View>
    );
}