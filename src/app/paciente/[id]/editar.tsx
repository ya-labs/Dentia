import { Stack, useLocalSearchParams } from 'expo-router';

import { FormularioPaciente } from '@/components/pacientes/FormularioPaciente';
import { Vazio } from '@/components/ui';
import { buscarPaciente, useDados } from '@/store';
import { voltarOu } from '@/utils/navegacao';

export default function EditarPacienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, atualizarPaciente } = useDados();
  const paciente = buscarPaciente(dados, id);

  return (
    <>
      <Stack.Screen options={{ title: 'Editar paciente' }} />
      {paciente ? (
        <FormularioPaciente
          inicial={paciente}
          onSalvar={(alterado) => {
            atualizarPaciente(paciente.id, alterado);
            voltarOu(`/paciente/${paciente.id}`);
          }}
        />
      ) : (
        <Vazio icone="person-outline" titulo="Paciente não encontrado" />
      )}
    </>
  );
}
