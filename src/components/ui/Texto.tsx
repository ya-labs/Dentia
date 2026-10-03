import { StyleSheet, Text, TextProps } from 'react-native';

import { cores, tipografia, VarianteTexto } from '@/theme';

type Props = TextProps & {
  variante?: VarianteTexto;
  cor?: string;
  /** Atalho para a cor secundária. */
  suave?: boolean;
};

export function Texto({ variante = 'corpo', cor, suave, style, ...rest }: Props) {
  return (
    <Text
      style={[styles.base, tipografia[variante], { color: cor ?? (suave ? cores.textoSecundario : cores.texto) }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
