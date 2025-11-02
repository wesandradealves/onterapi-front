import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import PublicLayout from './index';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

const useRouter = require('next/router').useRouter as jest.Mock;
const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL = 'https://app.onterapi.com';
const SITE_URL_WITH_SLASH = `${SITE_URL}/`;
const LOGIN_TITLE = 'Entrar | OnTerapi';
const DEFAULT_TITLE = 'OnTerapi | Plataforma completa para terapias e clinicas';
const LOGIN_DESCRIPTION =
  'Acesse o painel OnTerapi para acompanhar pacientes, agenda, equipe e fluxos terapeuticos com seguranca.';
const CANONICAL_SELECTOR = 'link[rel="canonical"]';

describe('PublicLayout', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    useRouter.mockReset();
    process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL;
  });

  it('renderiza conteudo e metas de SEO para rotas conhecidas', async () => {
    useRouter.mockReturnValue({ pathname: '/login', asPath: '/login' });

    render(
      <PublicLayout>
        <div>Conteudo</div>
      </PublicLayout>
    );

    expect(screen.getByText('Conteudo')).toBeInTheDocument();

    await waitFor(() => expect(document.querySelector('title')).toHaveTextContent(LOGIN_TITLE));
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute(
      'content',
      LOGIN_DESCRIPTION
    );
    expect(document.querySelector(CANONICAL_SELECTOR)).toBeNull();
  });

  it('utiliza seo default e canonical quando site url definida (com barra final)', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL_WITH_SLASH;
    useRouter.mockReturnValue({ pathname: '/qualquer-coisa', asPath: '/custom-path' });

    render(
      <PublicLayout>
        <div>Outra pagina</div>
      </PublicLayout>
    );

    await waitFor(() =>
      expect(document.querySelector('title')).toHaveTextContent(DEFAULT_TITLE)
    );
    const canonical = document.querySelector(CANONICAL_SELECTOR);
    expect(canonical).toHaveAttribute('href', `${SITE_URL}/custom-path`);
  });

  it('resolve metadados dinamicos para rotas com segmentos adicionais', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;
    useRouter.mockReturnValue({
      pathname: '/recover/[token]',
      asPath: '/recover/token-xyz?utm=1',
      query: { token: 'token-xyz' }
    });

    render(
      <PublicLayout>
        <div>Fluxo recuperar</div>
      </PublicLayout>
    );

    await waitFor(() =>
      expect(document.querySelector('title')).toHaveTextContent('Recuperar acesso | OnTerapi')
    );
    const canonical = document.querySelector(CANONICAL_SELECTOR);
    expect(canonical).toHaveAttribute('href', `${SITE_URL}/recover/token-xyz`);
  });

  it('usa pathname como fallback quando asPath contem apenas query string', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;
    useRouter.mockReturnValue({
      pathname: '/login',
      asPath: '?ref=email',
      query: { ref: 'email' }
    });

    render(
      <PublicLayout>
        <div>Query only path</div>
      </PublicLayout>
    );

    await waitFor(() => expect(document.querySelector('title')).toHaveTextContent(LOGIN_TITLE));
    const canonical = document.querySelector(CANONICAL_SELECTOR);
    expect(canonical).toHaveAttribute('href', SITE_URL);
  });

  it('utiliza seo default sem canonical quando pathname ausente', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;
    useRouter.mockReturnValue({ pathname: undefined, asPath: undefined });

    render(
      <PublicLayout>
        <div>Conteudo generico</div>
      </PublicLayout>
    );

    await waitFor(() =>
      expect(document.querySelector('title')).toHaveTextContent(DEFAULT_TITLE)
    );
    expect(document.querySelector(CANONICAL_SELECTOR)).toHaveAttribute(
      'href',
      SITE_URL
    );
  });
});
