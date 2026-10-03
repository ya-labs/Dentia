import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { cores } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: cores.primaria,
          headerTitleStyle: { color: cores.texto },
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
