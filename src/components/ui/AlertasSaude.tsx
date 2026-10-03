import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { cores, espaco, raio } from '@/theme';
import type { AlertaSaude } from '@/types';

import { Selo } from './Selo';
import { Texto } from './Texto';

type Props = {
  alertas: AlertaSaude[];
  /** `compacto` mostra só selos (listas e agenda); `faixa` destaca no topo da ficha. */
  modo?: 'compacto' | 'faixa';
};

export function AlertasSaude({ alertas, modo = 'compacto' }: Props) {
  if (alertas.length === 0) return null;

  if (modo === 'compacto') {
    return (
      <View style={styles.linha}>
        {alertas.map((a) => (
          <Selo key={a.perguntaId} texto={a.texto} cor={cores.perigo} fundo={cores.perigoSuave} icone="warning" />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.faixa} accessibilityRole="alert">
      <View style={styles.cabecalho}>
        <Ionicons name="warning" size={18} color={cores.perigo} />
        <Texto variante="corpoForte" cor={cores.perigo}>
          Atenção
        </Texto>
      </View>
      {alertas.map((a) => (
        <Texto key={a.perguntaId} cor={cores.perigo}>
          • {a.texto}
        </Texto>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.xs },
  faixa: {
    backgroundColor: cores.perigoSuave,
    borderRadius: raio.md,
    borderLeftWidth: 4,
    borderLeftColor: cores.perigo,
    padding: espaco.md,
    gap: espaco.xs,
  },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
});
