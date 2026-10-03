import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Dente } from '@/components/odontograma/Dente';
import { Botao, CampoTexto, Cartao, Escolhas, Pagina, Secao, Segmentos, Texto, Vazio } from '@/components/ui';
import { buscarPaciente, registrosDoDente, useDados } from '@/store';
import { cores, coresSituacaoDente, espaco } from '@/theme';
import type { FaceDente, RegistroDente, SituacaoDente, StatusProcedimento } from '@/types';
import { formatarData } from '@/utils/datas';
import {
  descreverRegistro,
  ehDeciduo,
  estadoDoDente,
  nomeFace,
  siglaFace,
  situacoesPorFace,
  todasFaces,
} from '@/utils/odontograma';

const situacoes = Object.keys(coresSituacaoDente) as SituacaoDente[];

export default function DetalheDenteScreen() {
  const { id, numero: numeroParam } = useLocalSearchParams<{ id: string; numero: string }>();
  const numero = Number(numeroParam);
  const { dados, criarRegistroDente, atualizarRegistroDente, removerRegistroDente } = useDados();
  const paciente = buscarPaciente(dados, id);
  const registros = registrosDoDente(dados, id, numero);

  const [editando, setEditando] = useState<RegistroDente | null>(null);
  const [situacao, setSituacao] = useState<SituacaoDente>('carie');
  const [faces, setFaces] = useState<FaceDente[]>([]);
  const [status, setStatus] = useState<StatusProcedimento>('planejado');
  const [observacao, setObservacao] = useState('');

  if (!paciente || !Number.isInteger(numero)) {
    return <Vazio icone="grid-outline" titulo="Dente não encontrado" />;
  }

  const porFace = situacoesPorFace.includes(situacao);
  const titulo = `Dente ${numero}${ehDeciduo(numero) ? ' (decíduo)' : ''}`;

  // Prévia: registros salvos (exceto o que está em edição) + o rascunho como mais recente.
  const rascunho: RegistroDente = {
    id: 'rascunho',
    pacienteId: paciente.id,
    dente: numero,
    faces: porFace ? faces : [],
    situacao,
    status,
    data: '9999-12-31',
  };
  const salvos = registros.filter((r) => r.id !== editando?.id);
  const previa = estadoDoDente(porFace && faces.length === 0 ? salvos : [...salvos, rascunho]);

  function carregar(r: RegistroDente) {
    setEditando(r);
    setSituacao(r.situacao);
    setFaces(r.faces);
    setStatus(r.status);
    setObservacao(r.observacao ?? '');
  }

  function salvar() {
    const dadosRegistro = {
      pacienteId: paciente!.id,
      dente: numero,
      faces: porFace ? todasFaces.filter((f) => faces.includes(f)) : [],
      situacao,
      status,
      observacao: observacao.trim() || undefined,
    };
    if (editando) atualizarRegistroDente(editando.id, dadosRegistro);
    else criarRegistroDente(dadosRegistro);
    router.back();
  }

  function remover(r: RegistroDente) {
    const confirmar = () => {
      removerRegistroDente(r.id);
      if (editando?.id === r.id) setEditando(null);
    };
    const mensagem = `${coresSituacaoDente[r.situacao].rotulo} de ${formatarData(r.data)}`;
    if (Platform.OS === 'web') {
      confirmar();
      return;
    }
    Alert.alert('Remover registro?', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: confirmar },
    ]);
  }

  const alternarFace = (f: FaceDente) => setFaces((atual) => (atual.includes(f) ? atual.filter((x) => x !== f) : [...atual, f]));

  return (
    <>
      <Stack.Screen options={{ title: titulo }} />
      <Pagina
        rodape={
          <Botao
            titulo={editando ? 'Salvar alterações' : 'Adicionar ao odontograma'}
            icone="checkmark"
            bloco
            disabled={porFace && faces.length === 0}
            onPress={salvar}
          />
        }
      >
        <View style={styles.topo}>
          <Dente numero={numero} estado={previa} tamanho={112} semNumero />
          <View style={styles.flex}>
            <Texto variante="subtitulo">{titulo}</Texto>
            <Texto suave>{paciente.nome}</Texto>
            <Texto variante="legenda" suave>
              A prévia mostra como o dente vai ficar na arcada.
            </Texto>
          </View>
        </View>

        {registros.length > 0 && (
          <Secao titulo="Registros deste dente">
            <Cartao style={styles.lista}>
              {registros.map((r) => (
                <View key={r.id} style={[styles.registro, editando?.id === r.id && styles.emEdicao]}>
                  <Pressable accessibilityRole="button" style={styles.flex} onPress={() => carregar(r)}>
                    <Texto variante="corpoForte">
                      {coresSituacaoDente[r.situacao].rotulo} · {r.status === 'realizado' ? 'Realizado' : 'Planejado'}
                    </Texto>
                    <Texto variante="legenda" suave>
                      {descreverRegistro(r)} · {formatarData(r.data)}
                      {r.observacao ? ` · ${r.observacao}` : ''}
                    </Texto>
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel="Remover registro" hitSlop={8} onPress={() => remover(r)}>
                    <Ionicons name="trash-outline" size={20} color={cores.perigo} />
                  </Pressable>
                </View>
              ))}
            </Cartao>
            {editando ? (
              <Botao titulo="Cancelar edição e criar novo" variante="fantasma" onPress={() => setEditando(null)} />
            ) : (
              <Texto variante="legenda" suave>
                Toque em um registro para editar.
              </Texto>
            )}
          </Secao>
        )}

        <Secao titulo={editando ? 'Editar registro' : 'Novo registro'}>
          <Cartao style={styles.formulario}>
            <Texto variante="rotulo" suave>
              Situação
            </Texto>
            <Escolhas
              opcoes={situacoes.map((s) => ({ valor: s, rotulo: coresSituacaoDente[s].rotulo, cor: coresSituacaoDente[s].cor }))}
              selecionados={[situacao]}
              onAlternar={setSituacao}
            />

            <Texto variante="rotulo" suave>
              Faces
            </Texto>
            {porFace ? (
              <>
                <Escolhas
                  opcoes={todasFaces.map((f) => ({
                    valor: f,
                    rotulo: `${siglaFace(f, numero)} · ${nomeFace(f, numero)}`,
                  }))}
                  selecionados={faces}
                  onAlternar={alternarFace}
                />
                {faces.length === 0 && (
                  <Texto variante="legenda" cor={cores.atencao}>
                    Selecione ao menos uma face.
                  </Texto>
                )}
              </>
            ) : (
              <Texto variante="legenda" suave>
                {coresSituacaoDente[situacao].rotulo} vale para o dente inteiro.
              </Texto>
            )}

            <Texto variante="rotulo" suave>
              Status
            </Texto>
            <Segmentos
              opcoes={[
                { valor: 'planejado', rotulo: 'Planejado' },
                { valor: 'realizado', rotulo: 'Realizado' },
              ]}
              valor={status}
              onChange={setStatus}
            />

            <CampoTexto rotulo="Observação" value={observacao} onChangeText={setObservacao} multiline />
          </Cartao>
        </Secao>
      </Pagina>
    </>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: espaco.lg },
  flex: { flex: 1, gap: espaco.xxs },
  lista: { gap: 0, paddingVertical: espaco.xs },
  registro: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, paddingVertical: espaco.sm },
  emEdicao: { opacity: 0.5 },
  formulario: { gap: espaco.md },
});
