import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { Button, Input, YStack, XStack, H2, Paragraph } from 'tamagui';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { authService } from '../lib/auth';

export default function RegisterScreen() {
    const router = useRouter();
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
        <ScrollView style={{ flex: 1, backgroundColor: '$background' }}>
            <YStack
                flex={1}
                padding="$4"
                space="$4"
                maxWidth={400}
                alignSelf="center"
                width="100%"
                paddingTop="$8"
            >
                <YStack space="$2" alignItems="center">
                    <H2 color="$color">Create Account</H2>
                    <Paragraph color="$color11" textAlign="center">
                        Join Yami and start collecting your favorites
                    </Paragraph>
                </YStack>

                <YStack space="$3">
                    <Input
                        placeholder="Full Name"
                        value={formData.name}
                        onChangeText={(value) => updateFormData('name', value)}
                        autoCapitalize="words"
                        size="$4"
                    />

                    <Input
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={(value) => updateFormData('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        size="$4"
                    />

                    <XStack alignItems="center" space="$2">
                        <Input
                            flex={1}
                            placeholder="Password"
                            value={formData.password}
                            onChangeText={(value) => updateFormData('password', value)}
                            secureTextEntry={!showPassword}
                            autoComplete="new-password"
                            size="$4"
                        />
                        <Button
                            size="$3"
                            variant="outlined"
                            icon={showPassword ? EyeOff : Eye}
                            onPress={() => setShowPassword(!showPassword)}
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
                        />
                        <Button
                            size="$3"
                            variant="outlined"
                            icon={showConfirmPassword ? EyeOff : Eye}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </XStack>
                </YStack>

                <YStack space="$3">
                    <Button
                        theme="blue"
                        size="$4"
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <XStack justifyContent="center" space="$2">
                        <Paragraph color="$color11" size="$3">
                            Already have an account?
                        </Paragraph>
                        <Button variant="outlined" size="$3" onPress={navigateToLogin}>
                            <Text style={{ color: '$white10' }}>Sign In</Text>
                        </Button>
                    </XStack>
                </YStack>
            </YStack>
        </ScrollView>
    );
}
