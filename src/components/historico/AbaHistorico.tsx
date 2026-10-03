import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MiniaturaAnexo } from '@/components/anexos/MiniaturaAnexo';
import { Botao, Cartao, Texto, Vazio } from '@/components/ui';
import { historicoDoPaciente, ItemHistorico, useDados } from '@/store';
import { cores, coresSituacaoDente, espaco } from '@/theme';
import type { Id } from '@/types';
import { formatarData } from '@/utils/datas';
import { descreverRegistro } from '@/utils/odontograma';

export function AbaHistorico({ pacienteId }: { pacienteId: Id }) {
  const { dados } = useDados();
  const itens = historicoDoPaciente(dados, pacienteId);

  return (
    <View style={styles.base}>
      <Botao
        titulo="Novo atendimento"
        icone="add"
        bloco
        onPress={() => router.push(`/paciente/${pacienteId}/atendimento/novo`)}
      />
      {itens.length === 0 ? (
        <Vazio icone="time-outline" titulo="Sem atendimentos" descricao="Os atendimentos e procedimentos realizados aparecem aqui." />
      ) : (
        <View style={styles.linhaDoTempo}>
          {itens.map((item) => (
            <ItemLinha key={item.tipo === 'atendimento' ? item.atendimento.id : item.registro.id} item={item} />
          ))}
        </View>
      )}
    </View>
  );
}

function ItemLinha({ item }: { item: ItemHistorico }) {
  const { dados } = useDados();

  if (item.tipo === 'odontograma') {
    const r = item.registro;
    return (
      <View style={styles.item}>
        <Marcador icone="grid" cor={coresSituacaoDente[r.situacao].cor} />
        <View style={styles.flex}>
          <Texto variante="legenda" suave>
            {formatarData(item.data)} · Odontograma
          </Texto>
          <Texto variante="corpoForte">
            {coresSituacaoDente[r.situacao].rotulo} no dente {r.dente}
          </Texto>
          <Texto variante="legenda" suave>
            {descreverRegistro(r)}
            {r.observacao ? ` · ${r.observacao}` : ''}
          </Texto>
        </View>
      </View>
    );
  }

  const a = item.atendimento;
  const anexos = dados.anexos.filter((x) => a.anexoIds.includes(x.id));
  return (
    <View style={styles.item}>
      <Marcador icone="medkit" cor={cores.primaria} />
      <Cartao style={styles.flex}>
        <Texto variante="legenda" suave>
          {formatarData(item.data)}
        </Texto>
        <Texto variante="corpoForte">{a.procedimento}</Texto>
        {a.dentes.length > 0 && (
          <Texto variante="legenda" suave>
            Dentes: {a.dentes.join(', ')}
          </Texto>
        )}
        {a.observacoes ? <Texto>{a.observacoes}</Texto> : null}
        {anexos.length > 0 && (
          <View style={styles.anexos}>
            {anexos.map((x) => (
              <MiniaturaAnexo key={x.id} anexo={x} tamanho={64} onPress={() => router.push(`/anexo/${x.id}`)} />
            ))}
          </View>
        )}
      </Cartao>
    </View>
  );
}

function Marcador({ icone, cor }: { icone: 'grid' | 'medkit'; cor: string }) {
  return (
    <View style={[styles.marcador, { borderColor: cor }]}>
      <Ionicons name={icone} size={14} color={cor} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { gap: espaco.lg },
  linhaDoTempo: { gap: espaco.md },
  item: { flexDirection: 'row', gap: espaco.md, alignItems: 'flex-start' },
  flex: { flex: 1 },
  marcador: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
    marginTop: espaco.xs,
  },
  anexos: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm, marginTop: espaco.xs },
});
