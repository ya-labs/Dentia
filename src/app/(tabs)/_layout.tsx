import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { ComponentProps } from 'react';

import { cores } from '@/theme';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

const abas: { nome: string; titulo: string; icone: NomeIcone; iconeAtivo: NomeIcone }[] = [
  { nome: 'index', titulo: 'Hoje', icone: 'today-outline', iconeAtivo: 'today' },
  { nome: 'agenda', titulo: 'Agenda', icone: 'calendar-outline', iconeAtivo: 'calendar' },
  { nome: 'pacientes', titulo: 'Pacientes', icone: 'people-outline', iconeAtivo: 'people' },
  { nome: 'ajustes', titulo: 'Ajustes', icone: 'settings-outline', iconeAtivo: 'settings' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: { backgroundColor: cores.superficie, borderTopColor: cores.borda },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      {abas.map((aba) => (
        <Tabs.Screen
          key={aba.nome}
          name={aba.nome}
          options={{
            title: aba.titulo,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? aba.iconeAtivo : aba.icone} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
