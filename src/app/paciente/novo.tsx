import { router, Stack } from 'expo-router';

import { FormularioPaciente } from '@/components/pacientes/FormularioPaciente';
import { useDados } from '@/store';

export default function NovoPacienteScreen() {
  const { criarPaciente } = useDados();

  return (
    <>
      <Stack.Screen options={{ title: 'Novo paciente' }} />
      <FormularioPaciente
        onSalvar={(dados, destino) => {
          const paciente = criarPaciente(dados);
          router.replace(
            destino === 'anamnese' ? `/paciente/${paciente.id}/anamnese?novo=1` : `/paciente/${paciente.id}`,
          );
        }}
      />
    </>
  );
}
