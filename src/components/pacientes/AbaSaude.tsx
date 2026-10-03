import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Botao, Cartao, Secao, Texto, Vazio } from '@/components/ui';
import { perguntasAnamnese, secoesAnamnese } from '@/data';
import { anamnesesDoPaciente, useDados } from '@/store';
import { cores, espaco } from '@/theme';
import type { Id, SecaoAnamnese } from '@/types';
import { formatarData } from '@/utils/datas';

/** Resumo da anamnese atual: só o que foi respondido "sim", agrupado por seção. */
export function AbaSaude({ pacienteId }: { pacienteId: Id }) {
  const { dados } = useDados();
  const versoes = anamnesesDoPaciente(dados, pacienteId);
  const atual = versoes[0];
  const irParaAnamnese = () => router.push(`/paciente/${pacienteId}/anamnese`);

  if (!atual) {
    return (
      <Vazio icone="clipboard-outline" titulo="Anamnese não preenchida" descricao="Preencha antes do primeiro atendimento.">
        <Botao titulo="Preencher anamnese" icone="create-outline" onPress={irParaAnamnese} />
      </Vazio>
    );
  }

  const secoes = Object.keys(secoesAnamnese) as SecaoAnamnese[];
  const positivas = (secao: SecaoAnamnese) =>
    perguntasAnamnese.filter((p) => p.secao === secao && atual.respostas[p.id]?.sim);

  return (
    <View style={styles.base}>
      <View style={styles.linha}>
        <Texto variante="legenda" suave style={styles.flex}>
          Anamnese de {formatarData(atual.data)}
        </Texto>
        <Botao titulo="Atualizar" icone="create-outline" variante="secundario" onPress={irParaAnamnese} />
      </View>

      <Secao titulo="Queixa principal">
        <Cartao>
          <Texto>{atual.queixaPrincipal || 'Não informada.'}</Texto>
        </Cartao>
      </Secao>

      <Secao titulo="Medicamentos em uso">
        <Cartao>
          {atual.medicamentos.length > 0 ? (
            atual.medicamentos.map((m) => <Texto key={m}>• {m}</Texto>)
          ) : (
            <Texto suave>Nenhum.</Texto>
          )}
        </Cartao>
      </Secao>

      {secoes.map((secao) => {
        const lista = positivas(secao);
        return (
          <Secao key={secao} titulo={secoesAnamnese[secao]}>
            <Cartao>
              {lista.length === 0 ? (
                <Texto suave>Nada relatado.</Texto>
              ) : (
                lista.map((p) => {
                  const detalhe = atual.respostas[p.id]?.detalhe;
                  return (
                    <View key={p.id} style={styles.resposta}>
                      <Ionicons
                        name={p.risco ? 'warning' : 'checkmark-circle'}
                        size={16}
                        color={p.risco ? cores.perigo : cores.primaria}
                        style={styles.icone}
                      />
                      <View style={styles.flex}>
                        <Texto>{p.texto}</Texto>
                        {detalhe ? (
                          <Texto variante="legenda" suave>
                            {detalhe}
                          </Texto>
                        ) : null}
                      </View>
                    </View>
                  );
                })
              )}
            </Cartao>
          </Secao>
        );
      })}

      {versoes.length > 1 && (
        <Secao titulo="Versões anteriores">
          <Cartao>
            {versoes.slice(1).map((v) => (
              <Texto key={v.id} variante="legenda" suave>
                Anamnese de {formatarData(v.data)}
              </Texto>
            ))}
          </Cartao>
        </Secao>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { gap: espaco.lg },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  flex: { flex: 1 },
  resposta: { flexDirection: 'row', gap: espaco.sm },
  icone: { marginTop: 3 },
});
