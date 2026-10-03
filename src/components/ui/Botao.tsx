import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, View } from 'react-native';

import { cores, espaco, raio } from '@/theme';

import { Texto } from './Texto';

type Variante = 'primario' | 'secundario' | 'fantasma' | 'perigo';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  titulo: string;
  variante?: Variante;
  icone?: ComponentProps<typeof Ionicons>['name'];
  carregando?: boolean;
  /** Ocupa toda a largura disponível. */
  bloco?: boolean;
};

const estilos: Record<Variante, { fundo: string; texto: string; borda: string }> = {
  primario: { fundo: cores.primaria, texto: cores.textoInverso, borda: cores.primaria },
  secundario: { fundo: cores.primariaSuave, texto: cores.primariaEscura, borda: cores.primariaSuave },
  fantasma: { fundo: 'transparent', texto: cores.primaria, borda: cores.borda },
  perigo: { fundo: cores.perigo, texto: cores.textoInverso, borda: cores.perigo },
};

export function Botao({ titulo, variante = 'primario', icone, carregando, bloco, disabled, ...rest }: Props) {
  const e = estilos[variante];
  const inativo = disabled || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inativo }}
      disabled={inativo}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: e.fundo, borderColor: e.borda },
        bloco && styles.bloco,
        pressed && styles.pressionado,
        inativo && styles.inativo,
      ]}
      {...rest}
    >
      {carregando ? (
        <ActivityIndicator color={e.texto} />
      ) : (
        <View style={styles.conteudo}>
          {icone && <Ionicons name={icone} size={18} color={e.texto} />}
          <Texto variante="corpoForte" cor={e.texto}>
            {titulo}
          </Texto>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: espaco.lg,
    borderRadius: raio.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  bloco: { alignSelf: 'stretch' },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  pressionado: { opacity: 0.85 },
  inativo: { opacity: 0.5 },
});
