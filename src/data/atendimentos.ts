import type { Anexo, Atendimento } from '@/types';

export const atendimentos: Atendimento[] = [
  { id: 't01', pacienteId: 'p01', data: '2026-08-20', procedimento: 'Restauração em resina', dentes: [26], observacoes: 'Paciente relatou sensibilidade leve após o procedimento.', anexoIds: ['x01'] },
  { id: 't02', pacienteId: 'p02', data: '2026-07-02', procedimento: 'Avaliação e ajuste de prótese', dentes: [], observacoes: 'Suspender varfarina somente com orientação do cardiologista.', anexoIds: [] },
  { id: 't03', pacienteId: 'p03', data: '2026-09-12', procedimento: 'Profilaxia (limpeza)', dentes: [], observacoes: 'Gestante; evitar radiografias.', anexoIds: [] },
  { id: 't04', pacienteId: 'p04', data: '2026-09-05', procedimento: 'Avaliação inicial', dentes: [85], anexoIds: ['x02'] },
  { id: 't05', pacienteId: 'p05', data: '2026-01-15', procedimento: 'Extração', dentes: [36], anexoIds: ['x03'] },
  { id: 't06', pacienteId: 'p05', data: '2026-06-18', procedimento: 'Planejamento de implante', dentes: [36], observacoes: 'Solicitada tomografia.', anexoIds: ['x04', 'x05'] },
  { id: 't07', pacienteId: 'p06', data: '2025-09-01', procedimento: 'Restauração', dentes: [14], anexoIds: [] },
  { id: 't08', pacienteId: 'p07', data: '2026-05-27', procedimento: 'Ajuste de prótese parcial', dentes: [], observacoes: 'Usar luvas sem látex.', anexoIds: ['x06'] },
  { id: 't09', pacienteId: 'p09', data: '2026-09-25', procedimento: 'Moldagem para clareamento', dentes: [], anexoIds: ['x07'] },
];

/** Anexos fictícios: sem arquivo real (`uri` ausente); a interface mostra um marcador. */
export const anexos: Anexo[] = [
  { id: 'x01', pacienteId: 'p01', categoria: 'foto', tipo: 'imagem', titulo: 'Foto intraoral – pós restauração', data: '2026-08-20' },
  { id: 'x02', pacienteId: 'p04', categoria: 'raio-x', tipo: 'imagem', titulo: 'Radiografia interproximal', data: '2026-09-05' },
  { id: 'x03', pacienteId: 'p05', categoria: 'raio-x', tipo: 'imagem', titulo: 'Periapical do 36', data: '2026-01-15' },
  { id: 'x04', pacienteId: 'p05', categoria: 'exame', tipo: 'pdf', titulo: 'Tomografia – laudo', data: '2026-06-25' },
  { id: 'x05', pacienteId: 'p05', categoria: 'documento', tipo: 'pdf', titulo: 'Termo de consentimento – implante', data: '2026-06-18' },
  { id: 'x06', pacienteId: 'p07', categoria: 'foto', tipo: 'imagem', titulo: 'Prótese parcial superior', data: '2026-05-27' },
  { id: 'x07', pacienteId: 'p09', categoria: 'foto', tipo: 'imagem', titulo: 'Cor inicial dos dentes', descricao: 'Escala A3.', data: '2026-09-25' },
  { id: 'x08', pacienteId: 'p02', categoria: 'exame', tipo: 'pdf', titulo: 'Coagulograma', data: '2026-06-28' },
];
