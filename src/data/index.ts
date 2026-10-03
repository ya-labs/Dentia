// Dados fictícios iniciais. As telas leem e alteram esses dados pelo
// `DadosProvider` (`@/store`); as consultas ficam em `@/store/selecoes`.

export { consultas, consultorio, gerarConsultas } from './agenda';
export { anamneses, perguntasAnamnese, secoesAnamnese } from './anamnese';
export { anexos, atendimentos } from './atendimentos';
export { dentesDeciduos, dentesPermanentes, registrosDentes } from './odontograma';
export { pacientes } from './pacientes';
