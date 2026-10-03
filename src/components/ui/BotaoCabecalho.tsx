import { Pressable, StyleSheet } from 'react-native';

import { cores, espaco } from '@/theme';

import { Texto } from './Texto';

type Props = { titulo: string; onPress: () => void };

/** Ação em texto para o cabeçalho nativo (ex.: "Editar"). */
export function BotaoCabecalho({ titulo, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8} style={styles.base}>
      {({ pressed }) => (
        <Texto variante="corpoForte" cor={cores.primaria} style={pressed && styles.pressionado}>
          {titulo}
        </Texto>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: espaco.xs },
  pressionado: { opacity: 0.5 },
});
