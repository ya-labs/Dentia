import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Texto } from '@/components/ui';
import { dentesDeciduos, dentesPermanentes } from '@/data';
import { cores, espaco } from '@/theme';
import type { RegistroDente } from '@/types';
import { estadoDoDente } from '@/utils/odontograma';

import { Dente } from './Dente';

export type Denticao = 'permanente' | 'decidua';

type Props = {
  denticao: Denticao;
  registros: RegistroDente[];
  onDente: (numero: number) => void;
  /** Espaço horizontal ocupado em volta da arcada (margens da tela e do cartão). */
  margem: number;
};

const GAP = espaco.xs;

/**
 * Arcadas superior e inferior divididas por quadrante, com 8 dentes por linha
 * (5 nos decíduos), para caber na largura do iPhone sem rolagem horizontal.
 */
export function Arcada({ denticao, registros, onDente, margem }: Props) {
  const { width } = useWindowDimensions();
  const mapa = denticao === 'permanente' ? dentesPermanentes : dentesDeciduos;
  const porLinha = mapa.superior.length / 2;
  // Mesmo tamanho para permanentes e decíduos, limitado para telas largas.
  const tamanho = Math.min(Math.floor((width - margem - GAP * 7) / 8), 48);

  const linha = (dentes: readonly number[]) => (
    <View style={styles.linha}>
      {dentes.map((n) => (
        <Dente
          key={n}
          numero={n}
          tamanho={tamanho}
          estado={estadoDoDente(registros.filter((r) => r.dente === n))}
          onPress={() => onDente(n)}
        />
      ))}
    </View>
  );

  const metade = (dentes: readonly number[]) => [dentes.slice(0, porLinha), dentes.slice(porLinha)] as const;
  const [sd, se] = metade(mapa.superior);
  const [id, ie] = metade(mapa.inferior);

  return (
    <View style={styles.base}>
      <Rotulo texto="Superior direito" />
      {linha(sd)}
      <Rotulo texto="Superior esquerdo" />
      {linha(se)}
      <View style={styles.divisor} />
      <Rotulo texto="Inferior direito" />
      {linha(id)}
      <Rotulo texto="Inferior esquerdo" />
      {linha(ie)}
    </View>
  );
}

function Rotulo({ texto }: { texto: string }) {
  return (
    <Texto variante="legenda" suave>
      {texto}
    </Texto>
  );
}

const styles = StyleSheet.create({
  base: { gap: espaco.xs },
  linha: { flexDirection: 'row', justifyContent: 'center', gap: GAP, marginBottom: espaco.xs },
  divisor: { height: StyleSheet.hairlineWidth, backgroundColor: cores.borda, marginVertical: espaco.sm },
});
