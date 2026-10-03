import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { espaco } from '@/theme';

import { Texto } from './Texto';

type Props = {
  titulo: string;
  /** Elemento à direita do título (ex.: link "Ver todos"). */
  acao?: ReactNode;
  children: ReactNode;
};

/** Bloco com título de seção em caixa alta, usado dentro das telas. */
export function Secao({ titulo, acao, children }: Props) {
  return (
    <View style={styles.base}>
      <View style={styles.cabecalho}>
        <Texto variante="rotulo" suave accessibilityRole="header">
          {titulo.toUpperCase()}
        </Texto>
        {acao}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { gap: espaco.sm },
  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 24 },
});
