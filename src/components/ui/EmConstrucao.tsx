import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { cores, espaco, raio } from '@/theme';

import { Cartao } from './Cartao';
import { Texto } from './Texto';

type Props = {
  icone: ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  itens: string[];
};

/** Marcador de tela provisória: lista o que a tela vai ter. */
export function EmConstrucao({ icone, titulo, itens }: Props) {
  return (
    <Cartao>
      <View style={styles.cabecalho}>
        <View style={styles.icone}>
          <Ionicons name={icone} size={22} color={cores.primaria} />
        </View>
        <View style={styles.textos}>
          <Texto variante="corpoForte">{titulo}</Texto>
          <Texto variante="legenda" suave>
            Tela em construção no protótipo
          </Texto>
        </View>
      </View>
      {itens.map((item) => (
        <View key={item} style={styles.item}>
          <Ionicons name="ellipse" size={6} color={cores.textoSecundario} />
          <Texto suave style={styles.textoItem}>
            {item}
          </Texto>
        </View>
      ))}
    </Cartao>
  );
}

const styles = StyleSheet.create({
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, marginBottom: espaco.xs },
  icone: {
    width: 40,
    height: 40,
    borderRadius: raio.md,
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  textoItem: { flex: 1 },
});
