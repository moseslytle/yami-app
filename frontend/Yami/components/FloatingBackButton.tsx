// Created 07/22/2025 by Linus Xiong
import { ArrowLeft } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingBackButtonProps {
	onPress?: () => void;
	visible?: boolean;
}

export function FloatingBackButton({ onPress, visible = true }: FloatingBackButtonProps) {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const handlePress = () => {
		if (onPress) {
			onPress();
		} else {
			router.back();
		}
	};

	if (!visible) return null;

	return (
		<View
			style={{
				position: 'absolute',
				top: insets.top + 16,
				left: 16,
				zIndex: 1000,
			}}
		>
			<Pressable
				onPress={handlePress}
				style={({ pressed }) => ({
					width: 44,
					height: 44,
					borderRadius: 22,
					backgroundColor: 'rgba(255, 255, 255, 0.9)',
					justifyContent: 'center',
					alignItems: 'center',
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.1,
					shadowRadius: 8,
					elevation: 4,
					transform: [{ scale: pressed ? 0.95 : 1 }],
				})}
			>
				<ArrowLeft
					color="#1F2937"
					size={20}
					strokeWidth={2.5}
				/>
			</Pressable>
		</View>
	);
}