// Created 07/20/2025 By Linus Xiong
import "../tamagui-web.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useState, useEffect } from 'react';
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";
import { useAuthStore } from "@/store/auth-store";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  }));

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
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme || 'light'}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="collections" options={{ title: "Collections" }} />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </TamaguiProvider>
  );
}