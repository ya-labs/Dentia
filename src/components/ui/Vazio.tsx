import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { cores, espaco } from '@/theme';

import { Texto } from './Texto';

type Props = {
  icone: ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  descricao?: string;
  /** Ação opcional abaixo do texto (ex.: botão de adicionar). */
  children?: ReactNode;
};

/** Estado vazio de listas e abas. */
export function Vazio({ icone, titulo, descricao, children }: Props) {
  return (
    <View style={styles.base}>
      <Ionicons name={icone} size={36} color={cores.textoSecundario} />
      <Texto variante="corpoForte" style={styles.centro}>
        {titulo}
      </Texto>
      {descricao && (
        <Texto suave style={styles.centro}>
          {descricao}
        </Texto>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', gap: espaco.sm, paddingVertical: espaco.xxl, paddingHorizontal: espaco.lg },
  centro: { textAlign: 'center' },
});
