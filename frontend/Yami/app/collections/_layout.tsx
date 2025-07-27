// Created 07/27/2025 By Linus Xiong
import { Stack } from "expo-router";

export default function CollectionsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
} 