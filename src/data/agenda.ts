import type { Consulta, Consultorio } from '@/types';
import { relativoAHoje } from '@/utils/datas';

export const consultorio: Consultorio = {
  nome: 'Consultório Odontológico Exemplo',
  dentista: 'Dr. Exemplo',
  cro: 'CRO-RS 00000',
  telefone: '(51) 3300-0000',
  endereco: 'Rua Exemplo, 100 – sala 2',
  horario: { inicio: '08:00', fim: '18:00', dias: [1, 2, 3, 4, 5] },
  duracaoPadraoMin: 45,
  mensagemWhatsApp:
    'Olá, {paciente}! Lembramos da sua consulta em {data} às {hora} no {consultorio}. Podemos confirmar?',
};

/**
 * Consultas geradas em relação à data atual, para que a tela Hoje e a agenda
 * sempre tenham conteúdo durante a demonstração.
 */
export function gerarConsultas(base: Date = new Date()): Consulta[] {
  const c = (
    id: string,
    pacienteId: string,
    dias: number,
    hora: string,
    procedimento: string,
    status: Consulta['status'],
    duracaoMin = 45,
  ): Consulta => ({ id, pacienteId, inicio: relativoAHoje(dias, hora, base), duracaoMin, procedimento, status });

  return [
    // Semana passada
    c('c01', 'p06', -6, '09:00', 'Avaliação', 'atendido'),
    c('c02', 'p08', -5, '14:00', 'Profilaxia', 'faltou'),
    c('c03', 'p09', -7, '10:30', 'Moldagem para clareamento', 'atendido'),

    // Hoje
    c('c04', 'p02', 0, '08:30', 'Ajuste de prótese', 'confirmado'),
    c('c05', 'p01', 0, '09:30', 'Restauração do 36', 'confirmado', 60),
    c('c06', 'p04', 0, '11:00', 'Tratamento do 85', 'agendado'),
    c('c07', 'p03', 0, '14:00', 'Retorno – gengiva', 'agendado', 30),
    c('c08', 'p07', 0, '16:00', 'Revisão da prótese', 'agendado'),

    // Próximos dias
    c('c09', 'p05', 1, '10:00', 'Cirurgia de implante', 'confirmado', 90),
    c('c10', 'p10', 1, '15:00', 'Primeira consulta', 'agendado', 30),
    c('c11', 'p06', 2, '09:00', 'Restauração do 24', 'agendado'),
    c('c12', 'p08', 3, '14:30', 'Profilaxia', 'agendado'),
    c('c13', 'p09', 4, '11:00', 'Clareamento – sessão 1', 'agendado', 60),
  ];
}

export const consultas: Consulta[] = gerarConsultas();
