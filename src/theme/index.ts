import { Platform, TextStyle, ViewStyle } from 'react-native';

import type { SituacaoDente, StatusConsulta } from '@/types';

/** Paleta "clínico claro": fundo claro com azul-petróleo como cor principal. */
export const cores = {
  primaria: '#0E6E80',
  primariaEscura: '#0A5361',
  primariaSuave: '#E3F1F3',

  fundo: '#F4F7F8',
  superficie: '#FFFFFF',
  superficieAlternativa: '#EEF3F4',
  borda: '#DCE4E7',

  texto: '#13252C',
  textoSecundario: '#5B6E75',
  textoInverso: '#FFFFFF',

  perigo: '#B42318',
  perigoSuave: '#FDECEA',
  atencao: '#B54708',
  atencaoSuave: '#FEF3DC',
  sucesso: '#067647',
  sucessoSuave: '#E3F8EC',
  info: '#175CD3',
  infoSuave: '#E8F0FD',
} as const;

export const espaco = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const raio = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const tipografia = {
  titulo: { fontSize: 28, fontWeight: '700', letterSpacing: 0.2 },
  subtitulo: { fontSize: 20, fontWeight: '600' },
  corpo: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  corpoForte: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  legenda: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  rotulo: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
} as const satisfies Record<string, TextStyle>;

export type VarianteTexto = keyof typeof tipografia;

export const sombra: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#0B2A33',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  default: { elevation: 1 },
});

/** Cores por status de consulta (agenda e tela Hoje). */
export const coresStatusConsulta: Record<StatusConsulta, { texto: string; fundo: string; rotulo: string }> = {
  agendado: { texto: cores.info, fundo: cores.infoSuave, rotulo: 'Agendado' },
  confirmado: { texto: cores.sucesso, fundo: cores.sucessoSuave, rotulo: 'Confirmado' },
  faltou: { texto: cores.perigo, fundo: cores.perigoSuave, rotulo: 'Faltou' },
  atendido: { texto: cores.textoSecundario, fundo: cores.superficieAlternativa, rotulo: 'Atendido' },
};

/** Cores e rótulos por situação do dente (odontograma). */
export const coresSituacaoDente: Record<SituacaoDente, { cor: string; rotulo: string }> = {
  carie: { cor: '#D92D20', rotulo: 'Cárie' },
  restauracao: { cor: '#1570EF', rotulo: 'Restauração' },
  canal: { cor: '#7A5AF8', rotulo: 'Canal' },
  coroa: { cor: '#DC6803', rotulo: 'Coroa' },
  extracao: { cor: '#344054', rotulo: 'Extração' },
  implante: { cor: '#0E9384', rotulo: 'Implante' },
};

export const tema = {
  cores,
  espaco,
  raio,
  tipografia,
  sombra,
  coresStatusConsulta,
  coresSituacaoDente,
} as const;
