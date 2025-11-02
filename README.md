# OnTerapi Frontend

Frontend scaffold alinhado ao `development-rules.md`, pronto para evoluir o produto com entregas modulares e cobertura total de testes.

## Visao Geral

- **Framework**: Next.js 14 + React 18.
- **UI**: Tailwind CSS como base utilitaria, SCSS pontual, Material UI para tokens e componentes.
- **Estado**: Redux Toolkit + React Redux, guards centralizados em hooks.
- **HTTP**: Axios com interceptors globais, loading compartilhado e tratamento de erros padronizado.
- **Experiencia**: Framer Motion (fade entre rotas), suporte PWA via `next-pwa`.
- **Qualidade**: Jest + Testing Library com threshold global de 100%.

## Modulo Atual: Autenticacao Publica

- Templates e layouts separando fluxo publico vs dashboard.
- Paginas `login`, `recover`, `two-factor` reutilizando o mesmo template.
- Formularios com React Hook Form + MUI, validacoes declarativas e campos reutilizaveis (atoms/molecules).
- Hooks dedicados (`useSignInForm`, `useRecoverPasswordForm`, `useTwoFactorForm`, `useInitializeSession`) isolando logica e side effects.
- Servicos `authApi`, `authSession`, `authStorage` encapsulando chamadas e persistencia com fallback seguro para SSR.
- Protecoes de rota via `useAuthGuard` e store `sessionSlice`.
- Textos centralizados em `assets/content/texts.json`, prontos para i18n.

## Estrutura de Pastas

```
src/
  assets/            # imagens, fontes, conteudos json
  components/        # atoms, molecules, organisms, templates reutilizaveis
  features/          # agrupamento completo por dominio (auth, ...)
  hooks/             # hooks globais
  layouts/           # layouts compartilhados (PublicLayout, etc.)
  lib/               # integracoes (axios, mui theme, fontawesome)
  pages/             # rotas Next.js (com sub-componentes locais)
  routes/            # configuracoes de rotas e regras de acesso
  services/          # servicos externos, analytics, etc.
  store/             # Redux store e slices
  styles/            # tokens e estilos globais
  utils/             # utilitarios (erros, textos, helpers)
```

## Scripts Principais

- `npm run dev` - ambiente de desenvolvimento.
- `npm run build` - build de producao.
- `npm run start` - servidor Next em modo producao.
- `npm run lint` - lint do projeto.
- `npm run test` - suite completa (unit e integracao) com relatorio de cobertura.
- `npm run test:unit` e `npm run test:integration` - suites separadas quando necessario.

## Setup Rapido

```bash
npm install
npm run dev
```

## Configuracao de API

Crie um arquivo `.env` na raiz do projeto com a variavel abaixo (ajuste o valor conforme o ambiente alvo):

```env
NEXT_PUBLIC_API_BASE_URL=https://onterapi.vercel.app
```

O Next.js carregara essa URL automaticamente durante `npm run dev` ou `npm run build`. Opcionalmente defina `NEXT_PUBLIC_SITE_URL` para que o layout gere links canonicos corretos.

## Qualidade e Testes

- `npm run test` garante cobertura atual **100%** (statements, branches, funcoes e linhas) e executa `src/quality/quality.spec.ts`, que roda o ESLint com regras SonarJS para travar duplicidades, ciclos e residuos de codigo.
- `npm run lint` utiliza `eslint-plugin-sonarjs` + `import/no-cycle` + `no-unused-vars` estrito para impedir violacoes de DRY/SOLID e dependencias ciclicas.
- Interceptors, hooks, layouts, paginas e componentes contam com testes dedicados localizados nos proprios diretorios.
- `useAuthGuard` validado com `useSyncExternalStore`, cobrindo redirecionamentos por role e etapa de two-factor.
- `authApi` e `authStorage` com mocks controlados para validar headers, fallback e operacoes sem navegador.

## Hooks de Git

- `.husky/pre-commit`: executa lint completo, `lint-staged` e a suite de testes em modo serial para evitar falsos positivos.
- `.husky/pre-push`: repete lint + testes garantindo que o estado enviado ao repositorio esteja 100% coberto.
  > Todos os hooks falham imediatamente se houver violacoes de qualidade, duplicidades ou queda de cobertura.

## Documentacao e Recursos

- Regras completas: `../development-rules.md`.
- Panorama do backend: `../backend-overview.md` + Swagger `https://onterapi.vercel.app/docs-json`.
- Fluxos de autenticacao: consultar `src/features/auth` (hooks, services, layouts).

## Proximos Passos Sugeridos

1. Expandir modulo de autenticacao com onboarding (signup) reutilizando o template atual.
2. Instanciar camada de templates/layouts para dashboard (area logada) com atomic design consistente.
3. Integrar monitoramento (observabilidade) seguindo regras de hooks centralizados.

> Todos os arquivos sao gravados em UTF-8 sem BOM conforme padrao do projeto.
