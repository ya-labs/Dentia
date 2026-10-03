import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { categoriasAnexo } from '@/components/anexos/MiniaturaAnexo';
import { Botao, CampoTexto, Escolhas, Texto, Vazio } from '@/components/ui';
import { buscarAnexo, buscarPaciente, useDados } from '@/store';
import { cores, espaco, raio } from '@/theme';
import type { Anexo, CategoriaAnexo } from '@/types';
import { formatarData } from '@/utils/datas';

export default function VisualizarAnexoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, atualizarAnexo } = useDados();
  const anexo = buscarAnexo(dados, id);
  const paciente = anexo && buscarPaciente(dados, anexo.pacienteId);

  const [descricao, setDescricao] = useState(anexo?.descricao ?? '');
  const [salvo, setSalvo] = useState(true);

  if (!anexo) return <Vazio icone="image-outline" titulo="Anexo não encontrado" />;

  const categorias = Object.keys(categoriasAnexo) as CategoriaAnexo[];

  return (
    <SafeAreaView edges={['bottom']} style={styles.area}>
      <Stack.Screen options={{ title: anexo.titulo }} />
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Visualizador anexo={anexo} />

        <View style={styles.info}>
          <Texto variante="subtitulo">{anexo.titulo}</Texto>
          <Texto suave>
            {formatarData(anexo.data)}
            {paciente ? ` · ${paciente.nome}` : ''}
          </Texto>

          <Texto variante="rotulo" suave>
            Categoria
          </Texto>
          <Escolhas
            opcoes={categorias.map((c) => ({ valor: c, rotulo: categoriasAnexo[c].rotulo }))}
            selecionados={[anexo.categoria]}
            onAlternar={(categoria) => atualizarAnexo(anexo.id, { categoria })}
          />

          <CampoTexto
            rotulo="Descrição"
            value={descricao}
            onChangeText={(t) => {
              setDescricao(t);
              setSalvo(false);
            }}
            multiline
            placeholder="Ex.: antes do tratamento"
          />
          <Botao
            titulo={salvo ? 'Descrição salva' : 'Salvar descrição'}
            icone={salvo ? 'checkmark' : 'save-outline'}
            variante="secundario"
            disabled={salvo}
            onPress={() => {
              atualizarAnexo(anexo.id, { descricao: descricao.trim() || undefined });
              setSalvo(true);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Imagem com zoom por pinça (iOS) ou PDF em tela cheia; anexos fictícios mostram um marcador. */
function Visualizador({ anexo }: { anexo: Anexo }) {
  const { width, height } = useWindowDimensions();
  const altura = Math.round(height * 0.55);

  if (!anexo.uri) {
    return (
      <View style={[styles.palco, styles.centro, { height: altura }]}>
        <Ionicons name={anexo.tipo === 'pdf' ? 'document-attach-outline' : categoriasAnexo[anexo.categoria].icone} size={56} color={cores.textoInverso} />
        <Texto cor={cores.textoInverso}>Anexo fictício, sem arquivo</Texto>
        <Texto variante="legenda" cor={cores.textoInverso}>
          Anexos novos mostram a imagem ou o PDF aqui.
        </Texto>
      </View>
    );
  }

  if (anexo.tipo === 'pdf') {
    return (
      <View style={[styles.palco, { height: altura }]}>
        {Platform.OS === 'web' ? (
          <View style={styles.centro}>
            <Texto cor={cores.textoInverso}>PDF disponível no aparelho.</Texto>
          </View>
        ) : (
          <WebView source={{ uri: anexo.uri }} originWhitelist={['*']} allowFileAccess style={styles.flex} />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.palco, { height: altura }]}
      contentContainerStyle={styles.imagemCentro}
      maximumZoomScale={4}
      minimumZoomScale={1}
      centerContent
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Image source={{ uri: anexo.uri }} style={{ width, height: altura }} resizeMode="contain" accessibilityLabel={anexo.titulo} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingBottom: espaco.xxl },
  palco: { backgroundColor: cores.texto },
  centro: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: espaco.sm, padding: espaco.lg },
  imagemCentro: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, borderRadius: raio.sm },
  info: { padding: espaco.lg, gap: espaco.md },
});
