# Orientações para IA

- Consulte o repositório (README, `docs/` e código) antes de propor mudanças.
- Respeite a stack: Expo + React Native + TypeScript com Expo Router. Não
  introduza bibliotecas novas sem necessidade clara.
- O app é um **protótipo**: dados fictícios em memória (`src/data`), sem login,
  servidor ou persistência, salvo decisão registrada em issue.
- Cores, espaçamentos e tipografia vêm do tema central (`src/theme`); não use
  valores soltos nas telas.
- Textos da interface em português do Brasil.
- Consulte o YABook para o padrão organizacional (issues, labels, `Size`,
  branches, commits e PRs).
- Mantenha rastreabilidade entre issue, branch, commit e Pull Request.
- Não invente formato quando houver padrão documentado.
- Dados de pacientes são dados pessoais sensíveis (LGPD): nunca use dados reais
  em exemplos, testes ou fixtures.

## Expo

- O Expo muda a cada SDK: antes de usar uma API, confira a documentação da
  versão em uso (`expo` no `package.json`): https://docs.expo.dev/versions/
- Adicione dependências com `npx expo install <pacote>` para obter versões
  compatíveis com a SDK.
- O protótipo roda no **Expo Go**: use apenas módulos incluídos nele. Bibliotecas
  com código nativo próprio exigem development build e ficam fora do protótipo.
- Rotas ficam em `src/app/` (Expo Router); código que não é tela fica fora dela.
- Antes de concluir uma tarefa, rode `npm run typecheck`.
