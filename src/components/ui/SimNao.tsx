import { Pressable, StyleSheet, View } from 'react-native';

import { cores, espaco, raio } from '@/theme';

import { Texto } from './Texto';

type Props = {
  pergunta: string;
  valor: boolean;
  onChange: (valor: boolean) => void;
  /** Destaca o "sim" em vermelho quando a resposta gera alerta. */
  risco?: boolean;
};

export function SimNao({ pergunta, valor, onChange, risco }: Props) {
  const corSim = risco ? cores.perigo : cores.primaria;
  return (
    <View style={styles.linha}>
      <Texto style={styles.pergunta}>{pergunta}</Texto>
      <View style={styles.botoes} accessibilityRole="radiogroup" accessibilityLabel={pergunta}>
        <Opcao rotulo="Não" ativo={!valor} cor={cores.textoSecundario} onPress={() => onChange(false)} />
        <Opcao rotulo="Sim" ativo={valor} cor={corSim} onPress={() => onChange(true)} />
      </View>
    </View>
  );
}

function Opcao({ rotulo, ativo, cor, onPress }: { rotulo: string; ativo: boolean; cor: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: ativo }}
      onPress={onPress}
      style={[styles.opcao, ativo ? { backgroundColor: cor, borderColor: cor } : styles.inativa]}
    >
      <Texto variante="rotulo" cor={ativo ? cores.textoInverso : cores.textoSecundario}>
        {rotulo}
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  pergunta: { flex: 1 },
  botoes: { flexDirection: 'row', gap: espaco.xs },
  opcao: {
    minWidth: 52,
    minHeight: 36,
    borderRadius: raio.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inativa: { backgroundColor: cores.superficie, borderColor: cores.borda },
});
