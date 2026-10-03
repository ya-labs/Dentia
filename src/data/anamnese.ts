import type { Anamnese, PerguntaAnamnese, SecaoAnamnese } from '@/types';

export const secoesAnamnese: Record<SecaoAnamnese, string> = {
  'saude-geral': 'Saúde geral',
  alergias: 'Alergias',
  'condicoes-atuais': 'Condições atuais',
  'historico-odontologico': 'Histórico odontológico',
};

/** Catálogo de perguntas da anamnese (sim/não, com detalhe quando "sim"). */
export const perguntasAnamnese: PerguntaAnamnese[] = [
  // Saúde geral
  { id: 'diabetes', secao: 'saude-geral', texto: 'Tem diabetes?', risco: true, detalhe: 'Tipo e controle', alerta: 'Diabetes' },
  { id: 'hipertensao', secao: 'saude-geral', texto: 'Tem pressão alta?', risco: true, alerta: 'Hipertensão' },
  { id: 'cardiaco', secao: 'saude-geral', texto: 'Tem problema cardíaco?', risco: true, detalhe: 'Qual?', alerta: 'Cardiopatia' },
  { id: 'coagulacao', secao: 'saude-geral', texto: 'Tem problema de coagulação ou sangra muito?', risco: true, alerta: 'Problema de coagulação' },
  { id: 'anticoagulante', secao: 'saude-geral', texto: 'Usa anticoagulante?', risco: true, detalhe: 'Qual?', alerta: 'Usa anticoagulante' },
  { id: 'infecciosa', secao: 'saude-geral', texto: 'Tem hepatite, HIV ou outra doença infecciosa?', risco: true, detalhe: 'Qual?', alerta: 'Doença infecciosa' },
  { id: 'respiratorio', secao: 'saude-geral', texto: 'Tem asma ou problema respiratório?', risco: true, alerta: 'Asma / respiratório' },
  { id: 'epilepsia', secao: 'saude-geral', texto: 'Tem epilepsia ou convulsões?', risco: true, alerta: 'Epilepsia' },
  { id: 'renal-hepatico', secao: 'saude-geral', texto: 'Tem problema renal ou no fígado?', risco: true, detalhe: 'Qual?', alerta: 'Problema renal/hepático' },
  { id: 'cirurgia', secao: 'saude-geral', texto: 'Já fez cirurgia ou ficou internado?', risco: false, detalhe: 'Quando e por quê?' },
  { id: 'tratamento', secao: 'saude-geral', texto: 'Está em tratamento médico?', risco: false, detalhe: 'Qual?' },

  // Alergias
  { id: 'alergia-antibiotico', secao: 'alergias', texto: 'Alergia a antibiótico (ex.: penicilina)?', risco: true, detalhe: 'Qual?', alerta: 'Alergia a antibiótico' },
  { id: 'alergia-anestesico', secao: 'alergias', texto: 'Alergia a anestésico?', risco: true, alerta: 'Alergia a anestésico' },
  { id: 'alergia-latex', secao: 'alergias', texto: 'Alergia a látex?', risco: true, alerta: 'Alergia a látex' },
  { id: 'alergia-dipirona', secao: 'alergias', texto: 'Alergia a dipirona?', risco: true, alerta: 'Alergia a dipirona' },
  { id: 'alergia-outra', secao: 'alergias', texto: 'Outra alergia?', risco: true, detalhe: 'Qual?', alerta: 'Outra alergia' },

  // Condições atuais
  { id: 'gestante', secao: 'condicoes-atuais', texto: 'Está gestante?', risco: true, detalhe: 'Quantas semanas?', alerta: 'Gestante' },
  { id: 'amamentando', secao: 'condicoes-atuais', texto: 'Está amamentando?', risco: false },
  { id: 'fumante', secao: 'condicoes-atuais', texto: 'É fumante?', risco: false, detalhe: 'Quantos por dia?' },
  { id: 'alcool', secao: 'condicoes-atuais', texto: 'Consome bebida alcoólica com frequência?', risco: false },

  // Histórico odontológico
  { id: 'sangramento-gengival', secao: 'historico-odontologico', texto: 'A gengiva sangra ao escovar?', risco: false },
  { id: 'sensibilidade', secao: 'historico-odontologico', texto: 'Tem sensibilidade nos dentes?', risco: false },
  { id: 'bruxismo', secao: 'historico-odontologico', texto: 'Range ou aperta os dentes?', risco: false },
  { id: 'reacao-anestesia', secao: 'historico-odontologico', texto: 'Já teve reação ruim a anestesia?', risco: true, detalhe: 'O que aconteceu?', alerta: 'Reação a anestesia' },
];

export const anamneses: Anamnese[] = [
  {
    id: 'a01',
    pacienteId: 'p01',
    data: '2026-08-20',
    queixaPrincipal: 'Sensibilidade ao tomar gelado no lado esquerdo.',
    medicamentos: [],
    respostas: {
      'alergia-antibiotico': { sim: true, detalhe: 'Penicilina' },
      sensibilidade: { sim: true },
    },
  },
  {
    id: 'a02',
    pacienteId: 'p02',
    data: '2026-07-02',
    queixaPrincipal: 'Revisão da prótese e dor ao mastigar.',
    medicamentos: ['Losartana 50 mg', 'Varfarina 5 mg'],
    respostas: {
      hipertensao: { sim: true },
      anticoagulante: { sim: true, detalhe: 'Varfarina' },
      cardiaco: { sim: true, detalhe: 'Fibrilação atrial' },
    },
  },
  {
    id: 'a03',
    pacienteId: 'p03',
    data: '2026-09-12',
    queixaPrincipal: 'Limpeza e avaliação de rotina.',
    medicamentos: [],
    respostas: {
      gestante: { sim: true, detalhe: '18 semanas' },
      'sangramento-gengival': { sim: true },
    },
  },
  {
    id: 'a04',
    pacienteId: 'p04',
    data: '2026-09-05',
    queixaPrincipal: 'Dor no dente de trás, lado direito.',
    medicamentos: [],
    respostas: {
      respiratorio: { sim: true, detalhe: 'Asma leve' },
    },
  },
  {
    id: 'a05',
    pacienteId: 'p05',
    data: '2026-06-18',
    queixaPrincipal: 'Quer avaliar implante no lugar do dente extraído.',
    medicamentos: ['Metformina 850 mg'],
    respostas: {
      diabetes: { sim: true, detalhe: 'Tipo 2, controlada' },
      fumante: { sim: true, detalhe: '10 por dia' },
      bruxismo: { sim: true },
    },
  },
  {
    id: 'a06',
    pacienteId: 'p07',
    data: '2026-05-27',
    queixaPrincipal: 'Ajuste da prótese parcial.',
    medicamentos: ['AAS 100 mg', 'Sinvastatina 20 mg'],
    respostas: {
      hipertensao: { sim: true },
      'alergia-latex': { sim: true },
      cirurgia: { sim: true, detalhe: 'Angioplastia em 2019' },
    },
  },
  {
    id: 'a07',
    pacienteId: 'p09',
    data: '2026-09-25',
    queixaPrincipal: 'Clareamento.',
    medicamentos: [],
    respostas: {},
  },
];
