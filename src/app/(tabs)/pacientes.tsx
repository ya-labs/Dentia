import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AlertasSaude, Avatar, Botao, CampoBusca, Cartao, Tela, Texto, Vazio } from '@/components/ui';
import { alertasDoPaciente, filtrarPacientes, ordenarPorNome, ultimaConsulta, useDados } from '@/store';
import { cores, espaco } from '@/theme';
import type { Paciente } from '@/types';
import { formatarData, idade } from '@/utils/datas';

export default function PacientesScreen() {
  const { dados } = useDados();
  const [busca, setBusca] = useState('');
  const lista = useMemo(() => filtrarPacientes(ordenarPorNome(dados.pacientes), busca), [dados.pacientes, busca]);

  return (
    <Tela
      titulo="Pacientes"
      subtitulo={`${dados.pacientes.length} cadastrados`}
      rolavel={false}
      acao={<Botao titulo="Novo" icone="person-add" onPress={() => router.push('/paciente/novo')} />}
    >
      <CampoBusca valor={busca} onChange={setBusca} placeholder="Buscar por nome ou telefone" />
      <FlatList
        data={lista}
        keyExtractor={(p) => p.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.lista}
        style={styles.flex}
        renderItem={({ item }) => <ItemPaciente paciente={item} />}
        ListEmptyComponent={
          <Vazio icone="search" titulo="Nenhum paciente encontrado" descricao="Confira o nome ou o telefone digitado.">
            <Botao titulo="Cadastrar paciente" variante="secundario" onPress={() => router.push('/paciente/novo')} />
          </Vazio>
        }
      />
    </Tela>
  );
}

function ItemPaciente({ paciente }: { paciente: Paciente }) {
  const { dados } = useDados();
  const alertas = alertasDoPaciente(dados, paciente.id);
  const ultima = ultimaConsulta(dados, paciente.id);

  return (
    <Cartao onPress={() => router.push(`/paciente/${paciente.id}`)} accessibilityLabel={`Abrir ficha de ${paciente.nome}`}>
      <View style={styles.linha}>
        <Avatar nome={paciente.nome} />
        <View style={styles.flex}>
          <Texto variante="corpoForte" numberOfLines={1}>
            {paciente.nome}
          </Texto>
          <Texto variante="legenda" suave>
            {idade(paciente.dataNascimento)} anos · {paciente.telefone}
          </Texto>
          <Texto variante="legenda" suave>
            {ultima ? `Última consulta: ${formatarData(ultima)}` : 'Sem atendimentos'}
          </Texto>
        </View>
        <Ionicons name="chevron-forward" size={18} color={cores.textoSecundario} />
      </View>
      <AlertasSaude alertas={alertas} />
    </Cartao>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  lista: { gap: espaco.md, paddingBottom: espaco.xxl },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
});
