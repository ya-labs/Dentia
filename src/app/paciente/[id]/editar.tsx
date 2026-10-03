import { router, Stack, useLocalSearchParams } from 'expo-router';

import { FormularioPaciente } from '@/components/pacientes/FormularioPaciente';
import { Vazio } from '@/components/ui';
import { buscarPaciente, useDados } from '@/store';

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
            router.back();
          }}
        />
      ) : (
        <Vazio icone="person-outline" titulo="Paciente não encontrado" />
      )}
    </>
  );
}
