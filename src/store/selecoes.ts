import { perguntasAnamnese } from '@/data';
import type { AlertaSaude, Anamnese, Atendimento, Consulta, Id, Paciente, RegistroDente } from '@/types';
import { lerData, mesmoDia } from '@/utils/datas';
import { normalizar, soDigitos } from '@/utils/texto';

import type { Dados } from './DadosProvider';

// Consultas puras sobre o estado em memória. -------------------------------

export function buscarPaciente(dados: Dados, id: Id): Paciente | undefined {
  return dados.pacientes.find((p) => p.id === id);
}

/** Versões da anamnese do paciente, da mais recente para a mais antiga. */
export function anamnesesDoPaciente(dados: Dados, pacienteId: Id): Anamnese[] {
  // Na mesma data, a versão registrada por último é a mais recente.
  return dados.anamneses
    .map((a, ordem) => ({ a, ordem }))
    .filter(({ a }) => a.pacienteId === pacienteId)
    .sort((x, y) => y.a.data.localeCompare(x.a.data) || y.ordem - x.ordem)
    .map(({ a }) => a);
}

export function anamneseAtual(dados: Dados, pacienteId: Id): Anamnese | undefined {
  return anamnesesDoPaciente(dados, pacienteId)[0];
}

/** Alertas derivados das respostas "sim" em perguntas de risco. */
export function alertasDaAnamnese(anamnese: Anamnese | undefined): AlertaSaude[] {
  if (!anamnese) return [];
  return perguntasAnamnese
    .filter((p) => p.risco && anamnese.respostas[p.id]?.sim)
    .map((p) => {
      const detalhe = anamnese.respostas[p.id]?.detalhe?.trim();
      const base = p.alerta ?? p.texto;
      return { perguntaId: p.id, texto: detalhe ? `${base}: ${detalhe}` : base };
    });
}

export function alertasDoPaciente(dados: Dados, pacienteId: Id): AlertaSaude[] {
  return alertasDaAnamnese(anamneseAtual(dados, pacienteId));
}

export function consultasDoDia(dados: Dados, dia: Date): Consulta[] {
  return dados.consultas
    .filter((c) => mesmoDia(lerData(c.inicio), dia))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}

export function registrosDoPaciente(dados: Dados, pacienteId: Id) {
  return dados.registrosDentes.filter((r) => r.pacienteId === pacienteId);
}

export function registrosDoDente(dados: Dados, pacienteId: Id, dente: number) {
  return registrosDoPaciente(dados, pacienteId)
    .filter((r) => r.dente === dente)
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function atendimentosDoPaciente(dados: Dados, pacienteId: Id) {
  return dados.atendimentos
    .filter((a) => a.pacienteId === pacienteId)
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function anexosDoPaciente(dados: Dados, pacienteId: Id) {
  return dados.anexos
    .map((a, ordem) => ({ a, ordem }))
    .filter(({ a }) => a.pacienteId === pacienteId)
    .sort((x, y) => y.a.data.localeCompare(x.a.data) || y.ordem - x.ordem)
    .map(({ a }) => a);
}

export function buscarAnexo(dados: Dados, id: Id) {
  return dados.anexos.find((a) => a.id === id);
}

export type ItemHistorico =
  | { tipo: 'atendimento'; data: string; atendimento: Atendimento }
  | { tipo: 'odontograma'; data: string; registro: RegistroDente };

/**
 * Linha do tempo do paciente: atendimentos e procedimentos realizados no
 * odontograma, do mais recente para o mais antigo.
 */
export function historicoDoPaciente(dados: Dados, pacienteId: Id): ItemHistorico[] {
  const itens: ItemHistorico[] = [
    ...dados.atendimentos
      .filter((a) => a.pacienteId === pacienteId)
      .map((atendimento) => ({ tipo: 'atendimento' as const, data: atendimento.data, atendimento })),
    ...dados.registrosDentes
      .filter((r) => r.pacienteId === pacienteId && r.status === 'realizado')
      .map((registro) => ({ tipo: 'odontograma' as const, data: registro.data, registro })),
  ];
  // Na mesma data, o atendimento aparece antes dos registros do odontograma.
  return itens.sort((a, b) => b.data.localeCompare(a.data) || (a.tipo === 'atendimento' ? -1 : 1));
}

/** Data do atendimento mais recente, se houver. */
export function ultimaConsulta(dados: Dados, pacienteId: Id): string | undefined {
  return atendimentosDoPaciente(dados, pacienteId)[0]?.data;
}

/** Busca por nome (sem acentos) ou por dígitos do telefone. */
export function filtrarPacientes(lista: Paciente[], termo: string): Paciente[] {
  const texto = normalizar(termo.trim());
  if (!texto) return lista;
  const digitos = soDigitos(termo);
  return lista.filter(
    (p) =>
      normalizar(p.nome).includes(texto) ||
      (digitos.length >= 3 && soDigitos(p.telefone).includes(digitos)),
  );
}

export function ordenarPorNome(lista: Paciente[]): Paciente[] {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}
