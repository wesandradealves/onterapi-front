# Changelog

## [0.2.5] - 2025-11-02

- Ajustado label do campo de login para exibir apenas "Email" conforme regra atual (textos centralizados e testes atualizados).

## [0.2.4] - 2025-11-02

- Centralizado `USER_ROLES` no `sessionSlice` para evitar duplicidade e garantir DRY entre store e servicos.
- Ajustado `PublicLayout` para usar `<main>` no wrapper, garantindo semantica de layout.

## [0.2.3] - 2025-11-02

- Corrigido o build na Vercel ao renomear paginas para `*.page.tsx`, configurar `pageExtensions` no Next e excluir stories do TypeScript.
- Normalizada a role do usuario em `authSession` garantindo compatibilidade com `UserRole` e cobrindo o fluxo com testes.
- Atualizados testes das paginas para os novos caminhos, mantendo cobertura total.

## [0.2.2] - 2025-11-02

- Reforcada a configuracao do ESLint com plugin SonarJS, `import/no-cycle` e `no-unused-vars` estrito para impedir duplicidades e riscos de manutencao.
- Criado `src/quality/quality.spec.ts` executando lint via Jest e bloqueando commits com violacoes de DRY/SOLID.
- Configurados hooks Husky (`pre-commit`, `pre-push`) que rodam lint completo, lint-staged e testes com cobertura 100%.
- Refatorados testes e rotas para reutilizar constantes, eliminando strings duplicadas exigidas pelas novas regras.

## [0.2.1] - 2025-11-02

- Alinhados os fluxos públicos (login, recuperação, two-factor) removendo switcher de idioma, cadastro aberto e social login.
- Eliminadas dependências órfãs (`LocaleSwitcher`, `SocialButton`) e textos não utilizados para manter governança de conteúdo.
- Padronizado hook `useSignInForm` (remoção de `rememberMe` e exposição desnecessária de `router`) e sincronizado contratos da API.
- Configurado NEXT_PUBLIC_API_BASE_URL via .env e carregamento automatico em testes (jest.setup.ts).
- Ajustados templates/páginas para evitar duplicidade de links e consolidar navegação de retorno ao login.
- Mantida cobertura de testes em 100% após a limpeza.

## [0.2.0] - 2025-11-02

- Implementado modulo completo de autenticacao publica (login, recuperacao de senha, two-factor) com templates reutilizados e textos centralizados.
- Adicionados hooks dedicados (`useSignInForm`, `useRecoverPasswordForm`, `useTwoFactorForm`, `useInitializeSession`) com integracao ao store, storage e interceptors.
- Criados servicos `authApi`, `authSession`, `authStorage` com fallback seguro para SSR e testes unitarios cobrindo headers, expiracao e persistencia.
- Atualizados componentes atoms/molecules/templates para cobrir variacoes (icones, mensagens de erro, toggles de senha) e reforcado atomic design.
- Expandida suita de testes para todas as camadas (components, hooks, services, pages) atingindo 100% de cobertura global.
- Reescritos README e CHANGELOG em UTF-8 sem BOM com informacoes de stack, modulos e metricas.

## [0.1.1] - 2025-11-01

- Ajustado `_app.tsx` para garantir Provider, guards e overlay em testes dedicados.
- Refatorados interceptors do Axios (`resolveBaseUrl`, `handle*`) e cobertos com Jest.
- Ampliada suita de hooks com `resolveGuardRedirect`, validacao por role e hooks tipados do store.
- Criado `tsconfig.jest.json` para suportar JSX no ts-jest e adicionado teste do App com overlay.
- Atualizado `LoadingOverlay` para `motion.create` garantindo 100% de cobertura em transicoes.
- Documentados README e CHANGELOG com metricas e scripts.
- Realocados testes para os diretorios dos respectivos modulos, removendo agregador `__tests__`.
- Simplificado `_app.tsx` e ajustados hooks (`useAuthGuard`, `useGlobalLoading`) para usar `useSyncExternalStore`.

## [0.1.0] - 2025-11-01

- Scaffold inicial criado conforme `development-rules.md` (estrutura de pastas, configuracoes base e dependencias obrigatorias).
