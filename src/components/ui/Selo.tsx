import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { coresStatusConsulta, espaco, raio } from '@/theme';
import type { StatusConsulta } from '@/types';

import { Texto } from './Texto';

type Props = {
  texto: string;
  cor: string;
  fundo: string;
  icone?: ComponentProps<typeof Ionicons>['name'];
};

/** Etiqueta compacta para status e categorias. */
export function Selo({ texto, cor, fundo, icone }: Props) {
  return (
    <View style={[styles.base, { backgroundColor: fundo }]}>
      {icone && <Ionicons name={icone} size={13} color={cor} />}
      <Texto variante="rotulo" cor={cor} numberOfLines={1}>
        {texto}
      </Texto>
    </View>
  );
}

export function SeloStatusConsulta({ status }: { status: StatusConsulta }) {
  const s = coresStatusConsulta[status];
  return <Selo texto={s.rotulo} cor={s.texto} fundo={s.fundo} />;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: espaco.sm,
    paddingVertical: espaco.xxs + 1,
    borderRadius: raio.pill,
  },
});
