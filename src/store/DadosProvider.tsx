import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { anamneses, anexos, atendimentos, consultas, consultorio, pacientes, registrosDentes } from '@/data';
import type { Anamnese, Anexo, Atendimento, Consulta, Consultorio, Id, Paciente, RegistroDente } from '@/types';
import { paraDataISO } from '@/utils/datas';

/** Todos os dados do protótipo. Vivem só em memória e voltam ao inicial ao fechar o app. */
export type Dados = {
  pacientes: typeof pacientes;
  anamneses: typeof anamneses;
  registrosDentes: typeof registrosDentes;
  atendimentos: typeof atendimentos;
  anexos: typeof anexos;
  consultas: typeof consultas;
  consultorio: typeof consultorio;
};

export type NovoPaciente = Omit<Paciente, 'id' | 'criadoEm'>;
export type NovaAnamnese = Omit<Anamnese, 'id' | 'pacienteId' | 'data'>;
export type NovoRegistroDente = Omit<RegistroDente, 'id' | 'data'>;
export type NovoAnexo = Omit<Anexo, 'id'>;
export type NovoAtendimento = Omit<Atendimento, 'id'>;
export type NovaConsulta = Omit<Consulta, 'id'>;

type Acoes = {
  criarPaciente: (dados: NovoPaciente) => Paciente;
  atualizarPaciente: (id: Id, dados: NovoPaciente) => void;
  /** Registra uma nova versão datada da anamnese, mantendo as anteriores. */
  salvarAnamnese: (pacienteId: Id, dados: NovaAnamnese) => void;
  criarRegistroDente: (dados: NovoRegistroDente) => void;
  atualizarRegistroDente: (id: Id, dados: NovoRegistroDente) => void;
  removerRegistroDente: (id: Id) => void;
  criarAnexos: (novos: NovoAnexo[]) => Anexo[];
  atualizarAnexo: (id: Id, alterado: Partial<NovoAnexo>) => void;
  criarAtendimento: (dados: NovoAtendimento) => Atendimento;
  criarConsulta: (dados: NovaConsulta) => Consulta;
  atualizarConsulta: (id: Id, alterado: Partial<NovaConsulta>) => void;
  removerConsulta: (id: Id) => void;
  atualizarConsultorio: (consultorio: Consultorio) => void;
};

type Contexto = Acoes & { dados: Dados };

const DadosContext = createContext<Contexto | null>(null);

let sequencia = 0;
/** Id local único durante a sessão (ex.: `p-lx3k9a-1`). */
export function novoId(prefixo: string): Id {
  sequencia += 1;
  return `${prefixo}-${Date.now().toString(36)}-${sequencia}`;
}

const dadosIniciais: Dados = {
  pacientes,
  anamneses,
  registrosDentes,
  atendimentos,
  anexos,
  consultas,
  consultorio,
};

export function DadosProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<Dados>(dadosIniciais);

  const acoes = useMemo<Acoes>(
    () => ({
      criarPaciente: (novo) => {
        const paciente: Paciente = { ...novo, id: novoId('p'), criadoEm: paraDataISO(new Date()) };
        setDados((d) => ({ ...d, pacientes: [...d.pacientes, paciente] }));
        return paciente;
      },
      atualizarPaciente: (id, alterado) =>
        setDados((d) => ({
          ...d,
          pacientes: d.pacientes.map((p) => (p.id === id ? { ...alterado, id, criadoEm: p.criadoEm } : p)),
        })),
      salvarAnamnese: (pacienteId, nova) =>
        setDados((d) => ({
          ...d,
          anamneses: [...d.anamneses, { ...nova, id: novoId('a'), pacienteId, data: paraDataISO(new Date()) }],
        })),
      criarRegistroDente: (novo) =>
        setDados((d) => ({
          ...d,
          registrosDentes: [...d.registrosDentes, { ...novo, id: novoId('r'), data: paraDataISO(new Date()) }],
        })),
      atualizarRegistroDente: (id, alterado) =>
        setDados((d) => ({
          ...d,
          registrosDentes: d.registrosDentes.map((r) => (r.id === id ? { ...alterado, id, data: r.data } : r)),
        })),
      removerRegistroDente: (id) =>
        setDados((d) => ({ ...d, registrosDentes: d.registrosDentes.filter((r) => r.id !== id) })),
      criarAnexos: (novos) => {
        const criados = novos.map((n) => ({ ...n, id: novoId('x') }));
        setDados((d) => ({ ...d, anexos: [...d.anexos, ...criados] }));
        return criados;
      },
      atualizarAnexo: (id, alterado) =>
        setDados((d) => ({ ...d, anexos: d.anexos.map((a) => (a.id === id ? { ...a, ...alterado } : a)) })),
      criarAtendimento: (novo) => {
        const atendimento: Atendimento = { ...novo, id: novoId('t') };
        setDados((d) => ({ ...d, atendimentos: [...d.atendimentos, atendimento] }));
        return atendimento;
      },
      criarConsulta: (nova) => {
        const consulta: Consulta = { ...nova, id: novoId('c') };
        setDados((d) => ({ ...d, consultas: [...d.consultas, consulta] }));
        return consulta;
      },
      atualizarConsulta: (id, alterado) =>
        setDados((d) => ({ ...d, consultas: d.consultas.map((c) => (c.id === id ? { ...c, ...alterado } : c)) })),
      removerConsulta: (id) => setDados((d) => ({ ...d, consultas: d.consultas.filter((c) => c.id !== id) })),
      atualizarConsultorio: (consultorio) => setDados((d) => ({ ...d, consultorio })),
    }),
    [],
  );

  const valor = useMemo(() => ({ dados, ...acoes }), [dados, acoes]);

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>;
}

export function useDados(): Contexto {
  const ctx = useContext(DadosContext);
  if (!ctx) throw new Error('useDados precisa estar dentro de <DadosProvider>.');
  return ctx;
}
