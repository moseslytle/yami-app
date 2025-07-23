// created 7/22/2025 by Moses Lytle - \
// updated 7/22/2025 by Moses Lytle - Refactored registration screen to support user flow and add logo

import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H2, Input, Paragraph, XStack, YStack } from 'tamagui';
import { AdvancedYamiLogo } from '../components/AdvancedYamiLogo';
import { FloatingBackButton } from '../components/FloatingBackButton';
import { authService } from '../lib/auth';

export default function RegisterScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const safeAreaInsets = useSafeAreaInsets();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            console.log('Starting registration...');
            const result = await authService.register({
                name: formData.name.trim(),
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            });

            console.log('Registration successful:', result);

            // Navigate immediately after successful registration
            console.log('About to navigate to OTP verification...');
            router.replace({
                pathname: '/otp-verification',
                params: { email: formData.email.toLowerCase().trim() }
            });
            console.log('Navigation call completed');

        } catch (error: any) {
            console.error('Registration error:', error);
            // Show the specific error message from the backend
            let errorMessage = 'Registration failed';
            if (error.message) {
                errorMessage = error.message;
            }
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToLogin = () => {
        router.push('/login');
    };

    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: colorScheme === 'dark' ? '#111111' : '#FFFFFF',
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
                    <H2 color="$color12">Create Account</H2>
                    <Paragraph color="$color11" textAlign="center">
                        Join Yami and start collecting your favorites
                    </Paragraph>
                </YStack>

                <YStack space="$3">
                    <XStack alignItems="center" space="$2">
                        <Input
                            flex={1}
                            placeholder="Full Name"
                            value={formData.name}
                            onChangeText={(value) => updateFormData('name', value)}
                            autoCapitalize="words"
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
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(value) => updateFormData('email', value)}
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
                            value={formData.password}
                            onChangeText={(value) => updateFormData('password', value)}
                            secureTextEntry={!showPassword}
                            autoComplete="new-password"
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

                    <XStack alignItems="center" space="$2">
                        <Input
                            flex={1}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChangeText={(value) => updateFormData('confirmPassword', value)}
                            secureTextEntry={!showConfirmPassword}
                            autoComplete="new-password"
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
                            icon={showConfirmPassword ? EyeOff : Eye}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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
                        onPress={handleRegister}
                        disabled={isLoading}
                        pressStyle={{ backgroundColor: "$brandPress" }}
                        fontWeight="600"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <XStack justifyContent="center" space="$2" alignItems="center">
                        <Paragraph color="$color11" size="$3">
                            Already have an account?
                        </Paragraph>
                        <Button 
                            variant="outlined" 
                            size="$3" 
                            onPress={navigateToLogin}
                            backgroundColor="transparent"
                            borderColor="transparent"
                            color="$brand"
                            pressStyle={{ backgroundColor: "$color3" }}
                        >
                            Sign In
                        </Button>
                    </XStack>
                </YStack>
            </YStack>
        </View>
    );
}
