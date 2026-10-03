import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DadosProvider } from '@/store';
import { cores } from '@/theme';

export default function RootLayout() {
  return (
    <DadosProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: cores.primaria,
          headerTitleStyle: { color: cores.texto },
          headerStyle: { backgroundColor: cores.superficie },
          headerBackTitle: 'Voltar',
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Início' }} />
      </Stack>
    </DadosProvider>
  );
}
