import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Alert, TextInput } from 'react-native';
import { Button, YStack, XStack, H2, Paragraph, Input } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../lib/auth';

export default function OTPVerificationScreen() {
    const router = useRouter();
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
            const response = await fetch('http://localhost:3000/api/v1/auth/otp/verify', {
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
            const response = await fetch('http://localhost:3000/api/v1/auth/otp/send', {
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
                <YStack space="$2" alignItems="center">
                    <H2 color="$color" textAlign="center">Verify Your Email</H2>
                    <Paragraph color="$color11" textAlign="center">
                        We've sent a 6-digit verification code to
                    </Paragraph>
                    <Paragraph color="$color" textAlign="center" fontWeight="bold">
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
                            />
                        ))}
                    </XStack>

                    <Button
                        theme="blue"
                        size="$4"
                        onPress={handleVerifyOTP}
                        disabled={isLoading || otp.join('').length !== 6}
                        width="100%"
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
                    >
                        Back to Registration
                    </Button>
                </YStack>
            </YStack>
        </View>
    );
}
