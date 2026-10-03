import { Stack, useLocalSearchParams } from 'expo-router';

import { FormularioConsulta } from '@/components/agenda/FormularioConsulta';
import { Vazio } from '@/components/ui';
import { buscarConsulta, useDados } from '@/store';

export default function EditarConsultaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados } = useDados();
  const consulta = buscarConsulta(dados, id);

  return (
    <>
      <Stack.Screen options={{ title: 'Consulta' }} />
      {consulta ? (
        <FormularioConsulta key={consulta.id} inicial={consulta} />
      ) : (
        <Vazio icone="calendar-clear-outline" titulo="Consulta não encontrada" />
      )}
    </>
  );
}
