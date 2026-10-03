import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, espaco } from '@/theme';

import { Texto } from './Texto';

type Props = {
  titulo: string;
  subtitulo?: string;
  /** Elemento à direita do título (ex.: botão de adicionar). */
  acao?: ReactNode;
  children: ReactNode;
  /** Desative quando a tela tiver lista própria (FlatList). */
  rolavel?: boolean;
};

/** Estrutura padrão das telas: área segura, título grande e conteúdo. */
export function Tela({ titulo, subtitulo, acao, children, rolavel = true }: Props) {
  const cabecalho = (
    <View style={styles.cabecalho}>
      <View style={styles.titulos}>
        <Texto variante="titulo" accessibilityRole="header">
          {titulo}
        </Texto>
        {subtitulo && <Texto suave>{subtitulo}</Texto>}
      </View>
      {acao}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.area}>
      {rolavel ? (
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          {cabecalho}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.conteudo, styles.fixo]}>
          {cabecalho}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.lg, gap: espaco.lg, paddingBottom: espaco.xxl },
  fixo: { flex: 1 },
  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: espaco.md },
  titulos: { flex: 1, gap: espaco.xs },
});
