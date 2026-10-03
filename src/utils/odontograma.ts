import type { FaceDente, RegistroDente, SituacaoDente, StatusProcedimento } from '@/types';

/** Situações que valem para o dente inteiro; as demais são marcadas por face. */
export const situacoesDenteInteiro: SituacaoDente[] = ['canal', 'coroa', 'extracao', 'implante'];
export const situacoesPorFace: SituacaoDente[] = ['carie', 'restauracao'];
export const todasFaces: FaceDente[] = ['M', 'D', 'O', 'V', 'L'];

export const quadrante = (dente: number) => Math.floor(dente / 10);
export const ehSuperior = (dente: number) => [1, 2, 5, 6].includes(quadrante(dente));
export const ehDeciduo = (dente: number) => quadrante(dente) >= 5;
/** Incisivos e caninos têm face incisal em vez de oclusal. */
export const ehAnterior = (dente: number) => dente % 10 <= 3;
/** Na tela, os quadrantes do lado direito do paciente ficam à esquerda; a face mesial aponta para o centro. */
export const mesialADireita = (dente: number) => [1, 4, 5, 8].includes(quadrante(dente));

export function siglaFace(face: FaceDente, dente: number): string {
  if (face === 'O') return ehAnterior(dente) ? 'I' : 'O';
  if (face === 'L') return ehSuperior(dente) ? 'P' : 'L';
  return face;
}

export function nomeFace(face: FaceDente, dente: number): string {
  switch (face) {
    case 'M':
      return 'Mesial';
    case 'D':
      return 'Distal';
    case 'O':
      return ehAnterior(dente) ? 'Incisal' : 'Oclusal';
    case 'V':
      return 'Vestibular';
    case 'L':
      return ehSuperior(dente) ? 'Palatina' : 'Lingual';
  }
}

export type Marcacao = { situacao: SituacaoDente; status: StatusProcedimento };

export type EstadoDente = {
  /** Situação do dente inteiro (coroa, extração…), se houver. */
  geral?: Marcacao;
  faces: Partial<Record<FaceDente, Marcacao>>;
};

/** Combina os registros do dente em ordem de data: o mais recente prevalece em cada face. */
export function estadoDoDente(registros: RegistroDente[]): EstadoDente {
  const estado: EstadoDente = { faces: {} };
  const ordenados = registros
    .map((r, ordem) => ({ r, ordem }))
    .sort((a, b) => a.r.data.localeCompare(b.r.data) || a.ordem - b.ordem)
    .map(({ r }) => r);

  for (const r of ordenados) {
    const marcacao = { situacao: r.situacao, status: r.status };
    if (situacoesPorFace.includes(r.situacao) && r.faces.length > 0) {
      for (const f of r.faces) estado.faces[f] = marcacao;
    } else {
      estado.geral = marcacao;
    }
  }
  return estado;
}

export function descreverRegistro(r: Pick<RegistroDente, 'faces' | 'dente'>): string {
  if (r.faces.length === 0) return 'Dente inteiro';
  return `Faces ${r.faces.map((f) => siglaFace(f, r.dente)).join(', ')}`;
}
