import { Pressable, StyleSheet, View } from 'react-native';

import { cores, espaco, raio, sombra } from '@/theme';

import { Texto } from './Texto';

export type OpcaoSegmento<T extends string> = { valor: T; rotulo: string };

type Props<T extends string> = {
  opcoes: OpcaoSegmento<T>[];
  valor: T;
  onChange: (valor: T) => void;
};

/** Alternância entre poucas opções exclusivas (abas internas, dia/semana). */
export function Segmentos<T extends string>({ opcoes, valor, onChange }: Props<T>) {
  return (
    <View style={styles.trilho} accessibilityRole="tablist">
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        return (
          <Pressable
            key={o.valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            onPress={() => onChange(o.valor)}
            style={[styles.opcao, ativo && styles.ativo]}
          >
            <Texto
              variante="rotulo"
              cor={ativo ? cores.primariaEscura : cores.textoSecundario}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {o.rotulo}
            </Texto>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: {
    flexDirection: 'row',
    backgroundColor: cores.superficieAlternativa,
    borderRadius: raio.md,
    padding: espaco.xxs + 1,
  },
  opcao: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: raio.sm,
    paddingHorizontal: espaco.xs,
  },
  ativo: { backgroundColor: cores.superficie, ...sombra },
});
