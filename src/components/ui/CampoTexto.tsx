import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { cores, espaco, raio, tipografia } from '@/theme';

import { Texto } from './Texto';

type Props = TextInputProps & {
  rotulo: string;
  ajuda?: string;
  erro?: string;
  obrigatorio?: boolean;
};

export function CampoTexto({ rotulo, ajuda, erro, obrigatorio, style, onFocus, onBlur, ...rest }: Props) {
  const [focado, setFocado] = useState(false);
  const corBorda = erro ? cores.perigo : focado ? cores.primaria : cores.borda;

  return (
    <View style={styles.container}>
      <Texto variante="rotulo" suave>
        {rotulo}
        {obrigatorio ? ' *' : ''}
      </Texto>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSecundario}
        style={[styles.input, { borderColor: corBorda }, rest.multiline && styles.multilinha, style]}
        onFocus={(e) => {
          setFocado(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {erro ? (
        <Texto variante="legenda" cor={cores.perigo}>
          {erro}
        </Texto>
      ) : ajuda ? (
        <Texto variante="legenda" suave>
          {ajuda}
        </Texto>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: espaco.xs },
  input: {
    ...tipografia.corpo,
    color: cores.texto,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderRadius: raio.md,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.md,
    minHeight: 48,
  },
  multilinha: { minHeight: 96, textAlignVertical: 'top' },
});
