import { Pressable, StyleSheet, View } from 'react-native';

import { cores, espaco, raio } from '@/theme';

import { Texto } from './Texto';

export type OpcaoEscolha<T extends string | number> = { valor: T; rotulo: string; cor?: string };

type Props<T extends string | number> = {
  opcoes: OpcaoEscolha<T>[];
  selecionados: T[];
  onAlternar: (valor: T) => void;
};

/** Chips tocáveis para escolha única ou múltipla; quem usa decide a regra. */
export function Escolhas<T extends string | number>({ opcoes, selecionados, onAlternar }: Props<T>) {
  return (
    <View style={styles.linha}>
      {opcoes.map((o) => {
        const ativo = selecionados.includes(o.valor);
        const cor = o.cor ?? cores.primaria;
        return (
          <Pressable
            key={String(o.valor)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: ativo }}
            onPress={() => onAlternar(o.valor)}
            style={({ pressed }) => [
              styles.chip,
              ativo ? { backgroundColor: cor, borderColor: cor } : styles.inativo,
              pressed && styles.pressionado,
            ]}
          >
            <Texto variante="rotulo" cor={ativo ? cores.textoInverso : cores.texto}>
              {o.rotulo}
            </Texto>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  chip: {
    minHeight: 36,
    paddingHorizontal: espaco.md,
    borderRadius: raio.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inativo: { backgroundColor: cores.superficie, borderColor: cores.borda },
  pressionado: { opacity: 0.8 },
});
