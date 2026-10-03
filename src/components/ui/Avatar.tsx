import { StyleSheet, View } from 'react-native';

import { cores } from '@/theme';
import { iniciais } from '@/utils/texto';

import { Texto } from './Texto';

type Props = { nome: string; tamanho?: number };

/** Avatar com as iniciais do paciente (o protótipo não guarda foto de perfil). */
export function Avatar({ nome, tamanho = 44 }: Props) {
  return (
    <View
      style={[styles.base, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Texto variante="corpoForte" cor={cores.primariaEscura} style={{ fontSize: tamanho * 0.38 }}>
        {iniciais(nome)}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center' },
});
