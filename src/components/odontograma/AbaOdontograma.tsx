import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Cartao, Secao, Segmentos, Selo, Texto } from '@/components/ui';
import { buscarPaciente, registrosDoPaciente, useDados } from '@/store';
import { cores, coresSituacaoDente, espaco } from '@/theme';
import type { Id } from '@/types';
import { formatarData, idade } from '@/utils/datas';
import { descreverRegistro, ehDeciduo } from '@/utils/odontograma';

import { Arcada, Denticao } from './Arcada';
import { corDaMarcacao } from './Dente';
import { Legenda } from './Legenda';

// Margens da tela e do cartão em volta da arcada.
const MARGEM = espaco.lg * 4;

export function AbaOdontograma({ pacienteId }: { pacienteId: Id }) {
  const { dados } = useDados();
  const paciente = buscarPaciente(dados, pacienteId);
  const registros = registrosDoPaciente(dados, pacienteId);
  const temDeciduos = registros.some((r) => ehDeciduo(r.dente));
  const crianca = paciente ? idade(paciente.dataNascimento) < 12 : false;
  const [denticao, setDenticao] = useState<Denticao>(crianca || temDeciduos ? 'decidua' : 'permanente');

  const abrirDente = (numero: number) => router.push(`/paciente/${pacienteId}/dente/${numero}`);
  const recentes = [...registros].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <View style={styles.base}>
      <Segmentos
        opcoes={[
          { valor: 'permanente', rotulo: 'Permanentes' },
          { valor: 'decidua', rotulo: 'Decíduos' },
        ]}
        valor={denticao}
        onChange={setDenticao}
      />

      <Cartao>
        <Texto variante="legenda" suave>
          Toque em um dente para marcar faces e situação.
        </Texto>
        <Arcada denticao={denticao} registros={registros} onDente={abrirDente} margem={MARGEM} />
      </Cartao>

      <Cartao>
        <Legenda />
      </Cartao>

      <Secao titulo={`Registros (${registros.length})`}>
        {recentes.length === 0 ? (
          <Texto suave>Nenhum registro no odontograma.</Texto>
        ) : (
          <Cartao style={styles.lista}>
            {recentes.map((r) => (
              <Pressable
                key={r.id}
                accessibilityRole="button"
                onPress={() => abrirDente(r.dente)}
                style={({ pressed }) => [styles.registro, pressed && styles.pressionado]}
              >
                <View style={[styles.cor, { backgroundColor: corDaMarcacao(r) }]} />
                <View style={styles.flex}>
                  <Texto variante="corpoForte">
                    Dente {r.dente} · {coresSituacaoDente[r.situacao].rotulo}
                  </Texto>
                  <Texto variante="legenda" suave>
                    {descreverRegistro(r)} · {formatarData(r.data)}
                    {r.observacao ? ` · ${r.observacao}` : ''}
                  </Texto>
                </View>
                <Selo
                  texto={r.status === 'realizado' ? 'Realizado' : 'Planejado'}
                  cor={r.status === 'realizado' ? cores.sucesso : cores.atencao}
                  fundo={r.status === 'realizado' ? cores.sucessoSuave : cores.atencaoSuave}
                />
                <Ionicons name="chevron-forward" size={16} color={cores.textoSecundario} />
              </Pressable>
            ))}
          </Cartao>
        )}
      </Secao>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { gap: espaco.lg },
  lista: { gap: 0, paddingVertical: espaco.xs },
  registro: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, paddingVertical: espaco.sm },
  pressionado: { opacity: 0.6 },
  cor: { width: 12, height: 12, borderRadius: 6 },
  flex: { flex: 1 },
});
