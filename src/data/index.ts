import type { AlertaSaude, Anamnese, Consulta, Id, Paciente } from '@/types';
import { lerData, mesmoDia } from '@/utils/datas';

import { consultas } from './agenda';
import { anamneses, perguntasAnamnese } from './anamnese';
import { anexos, atendimentos } from './atendimentos';
import { registrosDentes } from './odontograma';
import { pacientes } from './pacientes';

export { consultas, consultorio, gerarConsultas } from './agenda';
export { anamneses, perguntasAnamnese, secoesAnamnese } from './anamnese';
export { anexos, atendimentos } from './atendimentos';
export { dentesDeciduos, dentesPermanentes, registrosDentes } from './odontograma';
export { pacientes } from './pacientes';

// Consultas simples sobre os dados fictícios ---------------------------------

export function buscarPaciente(id: Id): Paciente | undefined {
  return pacientes.find((p) => p.id === id);
}

/** Anamnese mais recente do paciente. */
export function anamneseAtual(pacienteId: Id): Anamnese | undefined {
  return anamneses
    .filter((a) => a.pacienteId === pacienteId)
    .sort((a, b) => b.data.localeCompare(a.data))[0];
}

/** Alertas derivados das respostas "sim" em perguntas de risco. */
export function alertasDoPaciente(pacienteId: Id): AlertaSaude[] {
  const anamnese = anamneseAtual(pacienteId);
  if (!anamnese) return [];
  return perguntasAnamnese
    .filter((p) => p.risco && anamnese.respostas[p.id]?.sim)
    .map((p) => {
      const detalhe = anamnese.respostas[p.id]?.detalhe;
      const base = p.alerta ?? p.texto;
      return { perguntaId: p.id, texto: detalhe ? `${base}: ${detalhe}` : base };
    });
}

export function consultasDoDia(dia: Date): Consulta[] {
  return consultas
    .filter((c) => mesmoDia(lerData(c.inicio), dia))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

export function registrosDoPaciente(pacienteId: Id) {
  return registrosDentes.filter((r) => r.pacienteId === pacienteId);
}

export function atendimentosDoPaciente(pacienteId: Id) {
  return atendimentos
    .filter((a) => a.pacienteId === pacienteId)
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function anexosDoPaciente(pacienteId: Id) {
  return anexos
    .filter((a) => a.pacienteId === pacienteId)
    .sort((a, b) => b.data.localeCompare(a.data));
}

/** Data do atendimento mais recente, se houver. */
export function ultimaConsulta(pacienteId: Id): string | undefined {
  return atendimentosDoPaciente(pacienteId)[0]?.data;
}
