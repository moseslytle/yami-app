// Created 07/20/2025 By Linus Xiong
import "../global.css";
import "../tamagui-web.css";

import { useAuthStore } from "@/store/auth-store";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider, TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 3,
						staleTime: 1000 * 60 * 5,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	const [isInitialized, setIsInitialized] = useState(false);
	const { initializeAuth } = useAuthStore();

	useEffect(() => {
		const initialize = async () => {
			await initializeAuth();
			setIsInitialized(true);
		};

		initialize();
	}, [initializeAuth]);

	return (
		<SafeAreaProvider>
			<TamaguiProvider
				config={tamaguiConfig}
				defaultTheme={colorScheme || "light"}
			>
				<PortalProvider shouldAddRootHost>
					<QueryClientProvider client={queryClient}>
						<ThemeProvider
							value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
						>
							<StatusBar style="auto" />
							<Stack
								screenOptions={{
									headerShown: false,
								}}
							>
								<Stack.Screen name="(tabs)" />
							</Stack>
						</ThemeProvider>
					</QueryClientProvider>
				</PortalProvider>
			</TamaguiProvider>
		</SafeAreaProvider>
	);
}