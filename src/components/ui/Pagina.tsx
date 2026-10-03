import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, espaco } from '@/theme';

type Props = {
  children: ReactNode;
  /** Barra fixa no rodapé (ex.: botão Salvar), acima do teclado. */
  rodape?: ReactNode;
};

/** Conteúdo de telas empilhadas (com cabeçalho nativo): rolagem, teclado e área segura inferior. */
export function Pagina({ children, rodape }: Props) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.area}>
      <KeyboardAvoidingView
        style={styles.area}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {children}
        </ScrollView>
        {rodape && <View style={styles.rodape}>{rodape}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.lg, gap: espaco.lg, paddingBottom: espaco.xxl },
  rodape: {
    padding: espaco.lg,
    paddingBottom: espaco.md,
    gap: espaco.sm,
    backgroundColor: cores.superficie,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: cores.borda,
  },
});
