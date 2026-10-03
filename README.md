# Dentia

App mobile para organizar o consultório odontológico: cadastro de pacientes,
anamnese, odontograma, histórico de atendimentos, anexos e agenda.

**Estágio atual:** protótipo navegável para validar o produto com o dentista.
Usa dados fictícios em memória, sem login nem servidor.

## Stack

- [Expo](https://expo.dev) (SDK 57) + React Native + TypeScript
- Expo Router para navegação
- Distribuição do protótipo via **Expo Go** (iPhone e Android)
- Futuro: Supabase (Auth, Postgres, Storage) — fora do protótipo

## Como rodar

Pré-requisitos: Node.js 22+ e o app **Expo Go** instalado no celular.

```bash
npm install
npx expo start
```

Escaneie o QR code com a câmera do iPhone (ou pelo Expo Go no Android).
Celular e computador precisam estar na mesma rede; se não estiverem, use
`npx expo start --tunnel`.

Verificação de tipos:

```bash
npm run typecheck
```

> Recomendação: mantenha o repositório fora de pastas sincronizadas (OneDrive),
> porque `node_modules` tem dezenas de milhares de arquivos.

## Documentação

- [docs/README.md](docs/README.md) — índice
- [docs/escopo-prototipo.md](docs/escopo-prototipo.md) — escopo validado do protótipo

## Fluxo de trabalho (YABook / YA LABS)

Demanda → Issue → Branch → Commit → PR → Merge.

- **Labels:** tipo `bug`, `feature`, `docs`, `refactor`; domínio `frontend`,
  `backend`, `infra`, `ui/ux`, `architecture`, `process`, `ai`, `tooling`;
  especial `epic`.
- **GitHub Project:** campo `Size` de `1` a `5` (nunca como label ou título).
  Colunas: `Backlog`, `Pendente`, `Em andamento`, `Concluído`, `Ideias futuras`.
- **Responsável padrão por novas issues:** Nícolas Machado.
- **Branch:** `numero-descricao-curta` (ex.: `1-base-do-prototipo`).
- **Commit:** `tipo: descrição curta`.
- Padrão organizacional: YABook (Método YA LABS).
