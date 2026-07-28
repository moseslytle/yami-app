// created 7/22/2025 by Moses Lytle
// updated 7/22/2025 by Moses Lytle - Created otp verification screen to support user flow and add logo

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput, useColorScheme, View } from 'react-native';
import { Button, H2, Input, Paragraph, XStack, YStack } from 'tamagui';
import { FloatingBackButton } from '../components/FloatingBackButton';
import { API_BASE_URL } from '../lib/api-config';

export default function OTPVerificationScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { email } = useLocalSearchParams();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        // Start countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) return; // Prevent multiple characters

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        // Handle backspace
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            Alert.alert('Error', 'Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            // Call your OTP verification endpoint
            const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: otpCode,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Navigate immediately to login page after successful verification
                router.replace('/login');
            } else {
                Alert.alert('Verification Failed', data.errors?.[0] || 'Invalid or expired code');
                // Clear the OTP inputs on error
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/otp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'A new verification code has been sent to your email.');
                setCanResend(false);
                setCountdown(60);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                const data = await response.json();
                Alert.alert('Error', data.errors?.[0] || 'Failed to resend code. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateBack = () => {
        router.back();
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
                <YStack space="$2" alignItems="center">
                    <H2 color="$color12" textAlign="center">Verify Your Email</H2>
                    <Paragraph color="$color11" textAlign="center">
                        We've sent a 6-digit verification code to
                    </Paragraph>
                    <Paragraph color="$color12" textAlign="center" fontWeight="bold">
                        {email}
                    </Paragraph>
                </YStack>

                <YStack space="$4" alignItems="center">
                    <XStack space="$2" justifyContent="center">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                maxLength={1}
                                keyboardType="numeric"
                                textAlign="center"
                                size="$5"
                                width={50}
                                height={60}
                                fontSize="$6"
                                fontWeight="bold"
                                borderColor="$borderColor"
                                focusStyle={{ borderColor: "$brand" }}
                                backgroundColor="$background"
                                color="$color12"
                                borderRadius="$3"
                            />
                        ))}
                    </XStack>

                    <Button
                        backgroundColor="$brand"
                        color="white"
                        size="$4"
                        onPress={handleVerifyOTP}
                        disabled={isLoading || otp.join('').length !== 6}
                        width="100%"
                        pressStyle={{ backgroundColor: "$brandPress" }}
                        fontWeight="600"
                        opacity={otp.join('').length !== 6 ? 0.5 : 1}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </Button>
                </YStack>

                <YStack space="$3" alignItems="center">
                    <Paragraph color="$color11" size="$3" textAlign="center">
                        Didn't receive the code?
                    </Paragraph>

                    {canResend ? (
                        <Button
                            variant="outlined"
                            size="$3"
                            onPress={handleResendOTP}
                            disabled={isLoading}
                            borderColor="$brand"
                            color="$brand"
                            backgroundColor="$background"
                            pressStyle={{ backgroundColor: "$color3" }}
                        >
                            Resend Code
                        </Button>
                    ) : (
                        <Paragraph color="$color11" size="$3">
                            Resend in {countdown}s
                        </Paragraph>
                    )}

                    <Button
                        variant="outlined"
                        size="$3"
                        onPress={navigateBack}
                        borderColor="$borderColor"
                        color="$color11"
                        backgroundColor="$background"
                        pressStyle={{ backgroundColor: "$color3" }}
                    >
                        Back to Registration
                    </Button>
                </YStack>
            </YStack>
        </View>
    );
}
