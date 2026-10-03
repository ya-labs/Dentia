import { Pressable, StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import { comOpacidade, cores, coresSituacaoDente, raio } from '@/theme';
import type { FaceDente } from '@/types';
import { EstadoDente, ehSuperior, Marcacao, mesialADireita } from '@/utils/odontograma';

type Props = {
  numero: number;
  estado: EstadoDente;
  tamanho: number;
  onPress?: () => void;
  /** Esconde o número (ex.: prévia grande no detalhe). */
  semNumero?: boolean;
};

const SIMBOLO_GERAL = { extracao: '✕', implante: 'I', coroa: 'C', canal: 'Ca' } as const;

export function corDaMarcacao(m: Marcacao | undefined): string {
  if (!m) return cores.superficie;
  const cor = coresSituacaoDente[m.situacao].cor;
  return m.status === 'realizado' ? cor : comOpacidade(cor, 0.35);
}

/** Dente em cruz: faces vestibular/lingual em cima e embaixo, mesial e distal nas laterais, oclusal no centro. */
export function Dente({ numero, estado, tamanho, onPress, semNumero }: Props) {
  const superior = ehSuperior(numero);
  const [esquerda, direita]: FaceDente[] = mesialADireita(numero) ? ['D', 'M'] : ['M', 'D'];
  const [cima, baixo]: FaceDente[] = superior ? ['V', 'L'] : ['L', 'V'];
  const lateral = tamanho * 0.28;
  const geral = estado.geral;
  const corGeral = geral ? coresSituacaoDente[geral.situacao].cor : cores.borda;

  const face = (f: FaceDente, estilo: object) => (
    <View style={[styles.face, estilo, { backgroundColor: corDaMarcacao(estado.faces[f]) }]} />
  );

  const rotulo = (
    <Texto variante="legenda" suave style={styles.numero}>
      {numero}
    </Texto>
  );

  const descricao = [
    `Dente ${numero}`,
    geral && `${coresSituacaoDente[geral.situacao].rotulo} ${geral.status}`,
    ...Object.entries(estado.faces).map(([f, m]) => `${f}: ${coresSituacaoDente[m.situacao].rotulo} ${m.status}`),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={descricao}
      style={({ pressed }) => [styles.base, pressed && styles.pressionado]}
    >
      {!semNumero && superior && rotulo}
      <View
        style={[
          styles.caixa,
          {
            width: tamanho,
            height: tamanho,
            borderColor: corGeral,
            borderWidth: geral ? 3 : 1,
            borderStyle: geral?.status === 'planejado' ? 'dashed' : 'solid',
          },
        ]}
      >
        {face(cima, { height: lateral })}
        <View style={styles.meio}>
          {face(esquerda, { width: lateral })}
          {face('O', styles.centro)}
          {face(direita, { width: lateral })}
        </View>
        {face(baixo, { height: lateral })}
        {geral && (
          <View style={styles.sobreposicao} pointerEvents="none">
            <Texto
              variante="corpoForte"
              cor={geral.status === 'realizado' ? corGeral : comOpacidade(corGeral, 0.7)}
              style={{ fontSize: tamanho * (geral.situacao === 'extracao' ? 0.7 : 0.42) }}
            >
              {SIMBOLO_GERAL[geral.situacao as keyof typeof SIMBOLO_GERAL] ?? ''}
            </Texto>
          </View>
        )}
      </View>
      {!semNumero && !superior && rotulo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', gap: 2 },
  pressionado: { opacity: 0.6 },
  caixa: { borderRadius: raio.sm, overflow: 'hidden', backgroundColor: cores.superficie },
  meio: { flex: 1, flexDirection: 'row' },
  face: { borderColor: cores.borda, borderWidth: StyleSheet.hairlineWidth },
  centro: { flex: 1 },
  sobreposicao: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  numero: { fontSize: 11, lineHeight: 14 },
});
