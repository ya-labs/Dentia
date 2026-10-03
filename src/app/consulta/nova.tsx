import { Stack, useLocalSearchParams } from 'expo-router';

import { FormularioConsulta } from '@/components/agenda/FormularioConsulta';

export default function NovaConsultaScreen() {
  const { data, paciente } = useLocalSearchParams<{ data?: string; paciente?: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Nova consulta' }} />
      <FormularioConsulta dataInicial={data} pacienteInicial={paciente} />
    </>
  );
}
