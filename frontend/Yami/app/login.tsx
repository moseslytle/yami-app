// created 7/22/2025 by Moses Lytle - 
// updated 7/22/2025 by Moses Lytle - Refactored login screen to support user flow and add logo


import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, Input, YStack, XStack, H2, Paragraph } from 'tamagui';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from '@tamagui/lucide-icons';
import { authService } from '../lib/auth';
import { AdvancedYamiLogo } from '../components/AdvancedYamiLogo';

export default function LoginScreen() {
    const router = useRouter();
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
            await authService.login({
                email: email.toLowerCase().trim(),
                password: password,
            });

            // Navigate to main app
            router.replace('/collections');
        } catch (error) {
            Alert.alert('Login Failed', error.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        router.push('/register');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '$background' }}>
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
                    <H2 color="$color">Welcome Back</H2>
                    <Paragraph color="$color11" textAlign="center">
                        Sign in to your Yami account
                    </Paragraph>
                </YStack>

                <YStack space="$3">
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        icon={Mail}
                        size="$4"
                    />

                    <XStack alignItems="center" space="$2">
                        <Input
                            flex={1}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoComplete="password"
                            icon={Lock}
                            size="$4"
                        />
                        <Button
                            size="$3"
                            variant="ghost"
                            icon={showPassword ? EyeOff : Eye}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    </XStack>
                </YStack>

                <YStack space="$3">
                    <Button
                        theme="blue"
                        size="$4"
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Button
                        variant="outlined"
                        size="$4"
                        onPress={navigateToRegister}
                    >
                        Create Account
                    </Button>
                </YStack>

                <XStack justifyContent="center" space="$2">
                    <Paragraph color="$color11" size="$3">
                        Forgot your password?
                    </Paragraph>
                    <Button variant="ghost" size="$3">
                        <Text style={{ color: '$blue10' }}>Reset</Text>
                    </Button>
                </XStack>
            </YStack>
        </View>
    );
}
