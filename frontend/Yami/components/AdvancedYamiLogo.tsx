// created 7/22/2025 by Moses Lytle - Advanced animated Yami logo component

import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { YStack, Button } from 'tamagui';

interface AdvancedYamiLogoProps {
    size?: number;
    primaryColor?: string;
    secondaryColor?: string;
    animationDuration?: number;
    autoPlay?: boolean;
    showGlow?: boolean;
    showReplayButton?: boolean;
    onAnimationComplete?: () => void;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const AdvancedYamiLogo: React.FC<AdvancedYamiLogoProps> = ({
    size = 120,
    primaryColor = '#2563eb',
    secondaryColor = '#7c3aed',
    animationDuration = 4500, // Increased from 3000ms
    autoPlay = true,
    showGlow = true,
    showReplayButton = false,
    onAnimationComplete,
}) => {
    const animationProgress = useRef(new Animated.Value(0)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;

    // More stylized letter paths for YAMI with consistent spacing
    const letterPaths = {
        Y: "M10 15 L25 40 L40 15 M25 40 L25 65",        // Moved right slightly
        A: "M45 65 L60 15 L75 65 M52 45 L68 45",        // Close to Y
        M: "M90 65 L90 15 L105 45 L120 15 L120 65",     // Medium gap
        I: "M140 15 L140 65 M135 15 L145 15 M135 65 L145 65" // Moved left slightly
    };

    // Letter animation delays for sequential drawing
    const letterDelays = {
        Y: 0,
        A: 0.25,
        M: 0.5,
        I: 0.75
    };

    const startAnimation = () => {
        animationProgress.setValue(0);
        fadeIn.setValue(0);

        // Start with fade in
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 800, // Slower fade in
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: false,
        }).start();

        // Then start drawing animation
        Animated.timing(animationProgress, {
            toValue: 1,
            duration: animationDuration,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: false,
        }).start((finished) => {
            if (finished && onAnimationComplete) {
                onAnimationComplete();
            }
        });
    };

    useEffect(() => {
        if (autoPlay) {
            startAnimation();
        }
    }, [autoPlay]);

    // Calculate stroke animation for each letter
    const getStrokeAnimation = (letter: keyof typeof letterDelays) => {
        const delay = letterDelays[letter];
        const pathLength = 300; // Approximate path length
        const animationDuration = 0.25; // Duration for each letter animation
        const endTime = Math.min(delay + animationDuration, 1.0); // Ensure we don't exceed 1.0

        return {
            strokeDasharray: pathLength,
            strokeDashoffset: animationProgress.interpolate({
                inputRange: [0, delay, endTime, 1],
                outputRange: [pathLength, pathLength, 0, 0],
                extrapolate: 'clamp',
            }),
            opacity: fadeIn,
        };
    };

    // Scale animation for the whole logo
    const scaleValue = fadeIn.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
    });

    return (
        <YStack alignItems="center" justifyContent="center" space={showReplayButton ? "$4" : "$0"}>
            <Animated.View
                style={{
                    transform: [{ scale: scaleValue }],
                }}
            >
                <Svg
                    width={size * 1.4}
                    height={size * 0.6}
                    viewBox="0 0 200 80"
                >
                    <Defs>
                        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor={primaryColor} />
                            <Stop offset="100%" stopColor={secondaryColor} />
                        </LinearGradient>
                    </Defs>

                    <G>
                        {/* Y */}
                        <AnimatedPath
                            d={letterPaths.Y}
                            stroke="url(#logoGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            {...getStrokeAnimation('Y')}
                        />

                        {/* A */}
                        <AnimatedPath
                            d={letterPaths.A}
                            stroke="url(#logoGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            {...getStrokeAnimation('A')}
                        />

                        {/* M */}
                        <AnimatedPath
                            d={letterPaths.M}
                            stroke="url(#logoGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            {...getStrokeAnimation('M')}
                        />

                        {/* I */}
                        <AnimatedPath
                            d={letterPaths.I}
                            stroke="url(#logoGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            {...getStrokeAnimation('I')}
                        />
                    </G>
                </Svg>
            </Animated.View>


        </YStack>
    );
};

export default AdvancedYamiLogo;
