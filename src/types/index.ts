/**
 * Modelos de domínio do Dentia.
 * Pensados para serem trocados por tabelas do Supabase no produto final.
 * Datas em ISO 8601 (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm`).
 */

export type Id = string;

export interface Responsavel {
  nome: string;
  telefone: string;
  parentesco: string;
}

export interface Paciente {
  id: Id;
  nome: string;
  dataNascimento: string;
  telefone: string;
  email?: string;
  cpf?: string;
  endereco?: string;
  responsavel?: Responsavel;
  observacoes?: string;
  criadoEm: string;
}

// Anamnese ----------------------------------------------------------------

export type SecaoAnamnese =
  | 'saude-geral'
  | 'alergias'
  | 'condicoes-atuais'
  | 'historico-odontologico';

export interface PerguntaAnamnese {
  id: Id;
  secao: SecaoAnamnese;
  texto: string;
  /** Resposta "sim" gera alerta na ficha e na agenda. */
  risco: boolean;
  /** Rótulo do campo de detalhe exibido quando a resposta é "sim". */
  detalhe?: string;
  /** Texto curto usado no alerta (ex.: "Usa anticoagulante"). */
  alerta?: string;
}

export interface RespostaAnamnese {
  sim: boolean;
  detalhe?: string;
}

export interface Anamnese {
  id: Id;
  pacienteId: Id;
  data: string;
  queixaPrincipal: string;
  medicamentos: string[];
  /** Respostas indexadas pelo id da pergunta. Ausência equivale a "não". */
  respostas: Record<Id, RespostaAnamnese>;
}

export interface AlertaSaude {
  perguntaId: Id;
  texto: string;
}

// Odontograma -------------------------------------------------------------

/** Faces: Mesial, Distal, Oclusal/Incisal, Vestibular, Lingual/Palatina. */
export type FaceDente = 'M' | 'D' | 'O' | 'V' | 'L';

export type SituacaoDente =
  | 'carie'
  | 'restauracao'
  | 'canal'
  | 'coroa'
  | 'extracao'
  | 'implante';

export type StatusProcedimento = 'planejado' | 'realizado';

export interface RegistroDente {
  id: Id;
  pacienteId: Id;
  /** Numeração FDI (11–48 permanentes, 51–85 decíduos). */
  dente: number;
  faces: FaceDente[];
  situacao: SituacaoDente;
  status: StatusProcedimento;
  data: string;
  observacao?: string;
}

// Atendimentos e anexos ---------------------------------------------------

export interface Atendimento {
  id: Id;
  pacienteId: Id;
  data: string;
  procedimento: string;
  dentes: number[];
  observacoes?: string;
  anexoIds: Id[];
}

export type CategoriaAnexo = 'raio-x' | 'foto' | 'exame' | 'documento';

export interface Anexo {
  id: Id;
  pacienteId: Id;
  categoria: CategoriaAnexo;
  tipo: 'imagem' | 'pdf';
  titulo: string;
  descricao?: string;
  data: string;
  /** Endereço local do arquivo; ausente nos dados fictícios. */
  uri?: string;
}

// Agenda ------------------------------------------------------------------

export type StatusConsulta = 'agendado' | 'confirmado' | 'faltou' | 'atendido';

export interface Consulta {
  id: Id;
  pacienteId: Id;
  inicio: string;
  duracaoMin: number;
  procedimento: string;
  status: StatusConsulta;
  observacao?: string;
}

// Consultório -------------------------------------------------------------

export interface Consultorio {
  nome: string;
  dentista: string;
  cro: string;
  telefone: string;
  endereco: string;
  horario: {
    inicio: string;
    fim: string;
    /** Dias de atendimento: 0 = domingo … 6 = sábado. */
    dias: number[];
  };
  duracaoPadraoMin: number;
  /** Modelo da mensagem de lembrete. Variáveis: {paciente}, {data}, {hora}, {consultorio}. */
  mensagemWhatsApp: string;
}
