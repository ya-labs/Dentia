import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Botao, Escolhas, Texto, Vazio } from '@/components/ui';
import { anexosDoPaciente, useDados } from '@/store';
import { espaco } from '@/theme';
import type { CategoriaAnexo, Id } from '@/types';
import { ArquivoEscolhido, escolherDaGaleria, importarArquivo, tirarFoto } from '@/utils/arquivos';
import { paraDataISO } from '@/utils/datas';

import { categoriasAnexo, MiniaturaAnexo } from './MiniaturaAnexo';

type Filtro = CategoriaAnexo | 'todos';
const COLUNAS = 3;

/** Galeria por categoria. Tirar foto leva 3 toques: botão, disparo e "Usar foto". */
export function AbaAnexos({ pacienteId }: { pacienteId: Id }) {
  const { dados, criarAnexos } = useDados();
  const { width } = useWindowDimensions();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const todos = anexosDoPaciente(dados, pacienteId);
  const lista = filtro === 'todos' ? todos : todos.filter((a) => a.categoria === filtro);
  const tamanho = Math.floor((width - espaco.lg * 2 - espaco.sm * (COLUNAS - 1)) / COLUNAS);

  async function adicionar(escolher: () => Promise<ArquivoEscolhido | null>, padrao: CategoriaAnexo) {
    const arquivo = await escolher();
    if (!arquivo) return;
    const categoria = filtro === 'todos' ? (arquivo.tipo === 'pdf' ? 'exame' : padrao) : filtro;
    criarAnexos([{ ...arquivo, pacienteId, categoria, data: paraDataISO(new Date()) }]);
  }

  const contagem = (c: CategoriaAnexo) => todos.filter((a) => a.categoria === c).length;
  const categorias = Object.keys(categoriasAnexo) as CategoriaAnexo[];

  return (
    <View style={styles.base}>
      <View style={styles.acoes}>
        <View style={styles.flex}>
          <Botao titulo="Tirar foto" icone="camera" bloco onPress={() => adicionar(tirarFoto, 'foto')} />
        </View>
        <View style={styles.flex}>
          <Botao titulo="Galeria" icone="images-outline" variante="secundario" bloco onPress={() => adicionar(escolherDaGaleria, 'foto')} />
        </View>
      </View>
      <Botao titulo="Importar PDF ou arquivo" icone="document-attach-outline" variante="fantasma" bloco onPress={() => adicionar(importarArquivo, 'documento')} />

      <Escolhas
        opcoes={[
          { valor: 'todos' as Filtro, rotulo: `Todos (${todos.length})` },
          ...categorias.map((c) => ({ valor: c as Filtro, rotulo: `${categoriasAnexo[c].rotulo} (${contagem(c)})` })),
        ]}
        selecionados={[filtro]}
        onAlternar={setFiltro}
      />
      {filtro !== 'todos' && (
        <Texto variante="legenda" suave>
          Novos anexos entram em {categoriasAnexo[filtro].rotulo}.
        </Texto>
      )}

      {lista.length === 0 ? (
        <Vazio icone="images-outline" titulo="Nenhum anexo" descricao="Tire uma foto ou importe um exame." />
      ) : (
        <View style={styles.grade}>
          {lista.map((a) => (
            <MiniaturaAnexo key={a.id} anexo={a} tamanho={tamanho} comTitulo onPress={() => router.push(`/anexo/${a.id}`)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { gap: espaco.md },
  acoes: { flexDirection: 'row', gap: espaco.sm },
  flex: { flex: 1 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
});
