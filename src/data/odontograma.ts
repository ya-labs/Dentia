import type { RegistroDente } from '@/types';

/** Numeração FDI por quadrante, na ordem em que aparecem na arcada (da direita do paciente para a esquerda). */
export const dentesPermanentes = {
  superior: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  inferior: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
} as const;

export const dentesDeciduos = {
  superior: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  inferior: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
} as const;

export const registrosDentes: RegistroDente[] = [
  { id: 'r01', pacienteId: 'p01', dente: 26, faces: ['O'], situacao: 'restauracao', status: 'realizado', data: '2026-08-20' },
  { id: 'r02', pacienteId: 'p01', dente: 36, faces: ['O', 'D'], situacao: 'carie', status: 'planejado', data: '2026-08-20', observacao: 'Restaurar em resina.' },

  { id: 'r03', pacienteId: 'p02', dente: 16, faces: [], situacao: 'coroa', status: 'realizado', data: '2025-03-14' },
  { id: 'r04', pacienteId: 'p02', dente: 46, faces: [], situacao: 'extracao', status: 'realizado', data: '2024-12-02' },
  { id: 'r05', pacienteId: 'p02', dente: 47, faces: ['M', 'O'], situacao: 'carie', status: 'planejado', data: '2026-07-02' },

  { id: 'r06', pacienteId: 'p04', dente: 85, faces: ['O'], situacao: 'carie', status: 'planejado', data: '2026-09-05', observacao: 'Decíduo; avaliar com radiografia.' },

  { id: 'r07', pacienteId: 'p05', dente: 36, faces: [], situacao: 'extracao', status: 'realizado', data: '2026-01-15' },
  { id: 'r08', pacienteId: 'p05', dente: 36, faces: [], situacao: 'implante', status: 'planejado', data: '2026-06-18' },
  { id: 'r09', pacienteId: 'p05', dente: 21, faces: [], situacao: 'canal', status: 'realizado', data: '2025-10-09' },
  { id: 'r10', pacienteId: 'p05', dente: 21, faces: [], situacao: 'coroa', status: 'realizado', data: '2025-11-20' },

  { id: 'r11', pacienteId: 'p06', dente: 14, faces: ['M', 'O'], situacao: 'restauracao', status: 'realizado', data: '2025-09-01' },
  { id: 'r12', pacienteId: 'p06', dente: 24, faces: ['O'], situacao: 'carie', status: 'planejado', data: '2026-09-20' },
];
