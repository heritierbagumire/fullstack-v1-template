import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Platform } from 'react-native';

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack screenOptions={{
      headerShown: false,
      ...Platform.select({
        ios: {
          animation: 'slide_from_right',
        },
        android: {
          animation: 'fade_from_bottom',
        },
      }),
    }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="parking/entry"
        options={{
          presentation: 'modal',
          title: 'Register Vehicle Entry',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="parking/exit"
        options={{
          presentation: 'modal',
          title: 'Process Vehicle Exit',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="parking/session/[id]"
        options={{
          title: 'Parking Session',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="parking/slot/[id]"
        options={{
          title: 'Parking Slot',
          headerShown: true,
        }}
      />
    </Stack>
  );
}