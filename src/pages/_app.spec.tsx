import React from 'react';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import App from './_app';
import { store } from '../store';
import { setLoading } from '../store/slices/uiSlice';
import { useAuthGuard } from '../hooks/useAuthGuard';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
jest.mock('../hooks/useAuthGuard', () => ({
  useAuthGuard: jest.fn()
}));

const RouterMock = useRouter as jest.Mock;

const createRouter = (overrides: Record<string, unknown> = {}) =>
  ({
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    locale: undefined,
    locales: undefined,
    defaultLocale: undefined,
    isLocaleDomain: false,
    isFallback: false,
    isReady: true,
    isPreview: false,
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    push: jest.fn().mockResolvedValue(true),
    reload: jest.fn(),
    replace: jest.fn().mockResolvedValue(true),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    },
    forward: jest.fn(),
    ...overrides
  });

const TestPage = () => <div>Test Page</div>;

describe('Next App', () => {
  afterEach(() => {
    RouterMock.mockReset();
    (useAuthGuard as jest.Mock).mockReset();
    act(() => {
      store.dispatch(setLoading(false));
    });
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renderiza pagina, SEO padrao e overlay de carregamento', async () => {
    const router = createRouter({ pathname: '/public', route: '/public' }) as unknown as AppProps['router'];
    RouterMock.mockReturnValue(router);

    render(<App Component={TestPage} pageProps={{}} router={router} />);

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(useAuthGuard).toHaveBeenCalled();

    await waitFor(() => expect(document.title).toBe('OnTerapi | Plataforma completa para terapias e clinicas'));
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute(
      'content',
      'Centralize atendimentos, pacientes, agenda e toda a jornada terapeutica em um unico ambiente digital.'
    );

    act(() => {
      store.dispatch(setLoading(true));
    });

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });
});
