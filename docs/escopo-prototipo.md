# Escopo do protótipo

Escopo validado com o dentista. O protótipo serve para mostrar o app funcionando
no iPhone dele e decidir, juntos, o que entra no produto.

## Premissas

- Dados fictícios em memória; sem login, servidor ou sincronização.
- Um único tipo de acesso (sem separar dentista e secretária).
- Roda no iPhone pelo Expo Go.
- Visual "clínico claro": fundo claro, azul-petróleo como cor principal.

## Navegação

Barra inferior com quatro abas: **Hoje · Agenda · Pacientes · Ajustes**.

## Telas

| # | Tela | Descrição |
| --- | --- | --- |
| 1 | Hoje | Consultas do dia em ordem de horário, alertas de saúde dos pacientes e atalhos para nova consulta e novo paciente. |
| 2 | Lista de pacientes | Busca por nome ou telefone, com foto, idade e data da última consulta. |
| 3 | Novo / editar paciente | Dados pessoais, contato e responsável (menores); campos essenciais primeiro. |
| 4 | Ficha do paciente | Cabeçalho com nome, idade e alertas em destaque; abas Saúde, Odontograma, Histórico e Anexos. |
| 5 | Anamnese | Questionário sim/não com campo "qual?" quando sim; respostas de risco viram alertas. |
| 6 | Odontograma | Arcada com 32 dentes permanentes (opção de decíduos), colorida por situação, com legenda. |
| 7 | Detalhe do dente | Faces (M, D, O/I, V, L/P), situação (cárie, restauração, canal, coroa, extração, implante), planejado ou realizado, observação. |
| 8 | Histórico de atendimentos | Consultas com data e resumo; procedimentos do odontograma aparecem aqui. |
| 9 | Novo atendimento | Procedimento, dentes envolvidos, observações e foto na hora. |
| 10 | Anexos | Galeria por categoria (raio-x, fotos, exames, documentos); tirar foto ou importar arquivo. |
| 11 | Visualizar anexo | Foto ou PDF em tela cheia, com zoom, data e descrição. |
| 12 | Agenda | Visão de dia e semana, com status: agendado, confirmado, faltou, atendido. |
| 13 | Nova / editar consulta | Paciente, data, horário, duração, procedimento e botão "Lembrar pelo WhatsApp". |
| 14 | Ajustes | Dados do consultório, horário de atendimento, duração padrão e texto da mensagem de WhatsApp. |

## Anamnese

1. **Queixa principal** — texto livre.
2. **Saúde geral** — diabetes, hipertensão, problemas cardíacos, coagulação,
   doenças infecciosas, asma, epilepsia, problemas renais ou hepáticos,
   cirurgias/internações, tratamento médico atual.
3. **Medicamentos em uso** — lista livre (atenção a anticoagulantes,
   bisfosfonatos e anti-hipertensivos).
4. **Alergias** — antibióticos (penicilina), anestésico, látex, dipirona, outras.
5. **Condições atuais** — gestante (semanas), amamentando, fumante, álcool.
6. **Histórico odontológico** — última consulta, sangramento gengival,
   sensibilidade, bruxismo, reação a anestesia.

Respostas de risco aparecem como alerta no topo da ficha e na agenda. A
anamnese é datada e pode ser atualizada, mantendo versões anteriores.

## Fora do protótipo

Login, sincronização entre aparelhos, financeiro e orçamentos, lembrete
automático, acesso separado para secretária.

## Ideias futuras

Paciente preenche a anamnese por link, assinatura na tela, lembrete automático
pela API do WhatsApp, aniversariantes, retorno periódico, relatórios, vários
dentistas, venda como produto.
