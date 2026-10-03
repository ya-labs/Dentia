import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import { comOpacidade, cores, coresSituacaoDente, espaco, raio } from '@/theme';
import type { SituacaoDente } from '@/types';

const situacoes = Object.keys(coresSituacaoDente) as SituacaoDente[];

/** Legenda de todas as situações e da diferença entre planejado e realizado. */
export function Legenda() {
  return (
    <View style={styles.base}>
      <View style={styles.grade}>
        {situacoes.map((s) => (
          <View key={s} style={styles.item}>
            <View style={[styles.amostra, { backgroundColor: coresSituacaoDente[s].cor }]} />
            <Texto variante="legenda">{coresSituacaoDente[s].rotulo}</Texto>
          </View>
        ))}
      </View>
      <View style={styles.grade}>
        <View style={styles.item}>
          <View style={[styles.amostra, { backgroundColor: cores.texto }]} />
          <Texto variante="legenda" suave>
            Realizado (cor cheia)
          </Texto>
        </View>
        <View style={styles.item}>
          <View style={[styles.amostra, styles.planejado, { backgroundColor: comOpacidade(cores.texto, 0.35) }]} />
          <Texto variante="legenda" suave>
            Planejado (cor clara)
          </Texto>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { gap: espaco.sm },
  grade: { flexDirection: 'row', flexWrap: 'wrap', columnGap: espaco.md, rowGap: espaco.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
  amostra: { width: 14, height: 14, borderRadius: raio.sm / 2 },
  planejado: { borderWidth: 1, borderStyle: 'dashed', borderColor: cores.texto },
});
