import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AbaOdontograma } from '@/components/odontograma/AbaOdontograma';
import { AbaSaude } from '@/components/pacientes/AbaSaude';
import { CabecalhoPaciente } from '@/components/pacientes/CabecalhoPaciente';
import { AlertasSaude, BotaoCabecalho, EmConstrucao, Segmentos, Vazio } from '@/components/ui';
import type { OpcaoSegmento } from '@/components/ui';
import { alertasDoPaciente, buscarPaciente, useDados } from '@/store';
import { cores, espaco } from '@/theme';
import type { Id } from '@/types';

export type AbaFicha = 'saude' | 'odontograma' | 'historico' | 'anexos';

const abas: OpcaoSegmento<AbaFicha>[] = [
  { valor: 'saude', rotulo: 'Saúde' },
  { valor: 'odontograma', rotulo: 'Odontograma' },
  { valor: 'historico', rotulo: 'Histórico' },
  { valor: 'anexos', rotulo: 'Anexos' },
];

export default function FichaPacienteScreen() {
  const { id, aba: abaInicial } = useLocalSearchParams<{ id: string; aba?: AbaFicha }>();
  const { dados } = useDados();
  const paciente = buscarPaciente(dados, id);
  const [aba, setAba] = useState<AbaFicha>(abaInicial ?? 'saude');

  if (!paciente) {
    return (
      <>
        <Stack.Screen options={{ title: 'Ficha' }} />
        <Vazio icone="person-outline" titulo="Paciente não encontrado" />
      </>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.area}>
      <Stack.Screen
        options={{
          title: 'Ficha',
          headerRight: () => (
            <BotaoCabecalho titulo="Editar" onPress={() => router.push(`/paciente/${paciente.id}/editar`)} />
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <CabecalhoPaciente paciente={paciente} />
        <AlertasSaude alertas={alertasDoPaciente(dados, paciente.id)} modo="faixa" />
        <Segmentos opcoes={abas} valor={aba} onChange={setAba} />
        <ConteudoAba aba={aba} pacienteId={paciente.id} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ConteudoAba({ aba, pacienteId }: { aba: AbaFicha; pacienteId: Id }) {
  switch (aba) {
    case 'saude':
      return <AbaSaude pacienteId={pacienteId} />;
    case 'odontograma':
      return <AbaOdontograma pacienteId={pacienteId} />;
    case 'historico':
      return (
        <EmConstrucao
          icone="time-outline"
          titulo="Histórico"
          itens={['Atendimentos com data e resumo', 'Registro de novo atendimento']}
        />
      );
    case 'anexos':
      return (
        <EmConstrucao
          icone="images-outline"
          titulo="Anexos"
          itens={['Raio-x, fotos, exames e documentos', 'Tirar foto ou importar arquivo']}
        />
      );
  }
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.lg, gap: espaco.lg, paddingBottom: espaco.xxl },
});
