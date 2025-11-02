import React, { ReactNode } from 'react';
import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import { store } from '../store';
import { clearSession, setAuthenticatedSession, setTempToken } from '../store/slices/sessionSlice';
import { resolveGuardRedirect, useAuthGuard } from './useAuthGuard';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

const RouterMock = useRouter as jest.Mock;

const Wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const GuardProbe = () => {
  useAuthGuard();
  return null;
};

const authenticatedSession = {
  isAuthenticated: true,
  role: 'PROFESSIONAL' as const,
  accessToken: 'token',
  refreshToken: 'refresh',
  expiresAt: Date.now() + 1000,
  user: {
    id: '1',
    email: 'user@example.com',
    role: 'PROFESSIONAL' as const
  }
};

describe('useAuthGuard', () => {
  afterEach(() => {
    act(() => {
      store.dispatch(clearSession());
      store.dispatch(setTempToken(null));
    });
    RouterMock.mockReset();
  });

  it('resolves redirect fallbacks', () => {
    expect(resolveGuardRedirect(undefined, '/fallback')).toBe('/fallback');
    expect(resolveGuardRedirect('/target', '/fallback')).toBe('/target');
  });

  it('forces login flow for two-factor route without temp token', () => {
    const replaceMock = jest.fn();
    RouterMock.mockReturnValue({ pathname: '/two-factor', replace: replaceMock });
    render(
      <Wrapper>
        <GuardProbe />
      </Wrapper>
    );
    expect(replaceMock).toHaveBeenCalledWith('/login');
  });

  it('stays on two-factor when temp token presente', () => {
    const replaceMock = jest.fn();
    RouterMock.mockReturnValue({ pathname: '/two-factor', replace: replaceMock });
    act(() => {
      store.dispatch(setTempToken('temp'));
    });
    render(
      <Wrapper>
        <GuardProbe />
      </Wrapper>
    );
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('redireciona autenticado para dashboard quando em two-factor', () => {
    const replaceMock = jest.fn();
    RouterMock.mockReturnValue({ pathname: '/two-factor', replace: replaceMock });
    act(() => {
      store.dispatch(setTempToken('temp'));
      store.dispatch(setAuthenticatedSession(authenticatedSession));
    });
    render(
      <Wrapper>
        <GuardProbe />
      </Wrapper>
    );
    expect(replaceMock).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects authenticated users away from public-only routes', () => {
    const replaceMock = jest.fn();
    RouterMock.mockReturnValue({ pathname: '/login', replace: replaceMock });
    act(() => {
      store.dispatch(setAuthenticatedSession(authenticatedSession));
    });
    render(
      <Wrapper>
        <GuardProbe />
      </Wrapper>
    );
    expect(replaceMock).toHaveBeenCalledWith('/dashboard');
  });

  it('allows access to private routes when authenticated', () => {
    const replaceMock = jest.fn();
    RouterMock.mockReturnValue({ pathname: '/dashboard', replace: replaceMock });
    act(() => {
      store.dispatch(setAuthenticatedSession(authenticatedSession));
    });
    render(
      <Wrapper>
        <GuardProbe />
      </Wrapper>
    );
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('blocks unauthorized roles from restricted routes', () => {
    const replaceMock = jest.fn();
    RouterMock.mockReturnValue({ pathname: '/settings', replace: replaceMock });
    act(() => {
      store.dispatch(setAuthenticatedSession(authenticatedSession));
    });
    render(
      <Wrapper>
        <GuardProbe />
      </Wrapper>
    );
    expect(replaceMock).toHaveBeenCalledWith('/dashboard');
  });

  it('allows authorized roles to stay on restricted routes', () => {
    const replaceMock = jest.fn();
    RouterMock.mockReturnValue({ pathname: '/settings', replace: replaceMock });
    act(() => {
      store.dispatch(
        setAuthenticatedSession({
          ...authenticatedSession,
          role: 'MANAGER',
          user: { ...authenticatedSession.user, role: 'MANAGER' }
        })
      );
    });
    render(
      <Wrapper>
        <GuardProbe />
      </Wrapper>
    );
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('ignores routes without configured rules', () => {
    const replaceMock = jest.fn();
    RouterMock.mockReturnValue({ pathname: '/public-info', replace: replaceMock });
    render(
      <Wrapper>
        <GuardProbe />
      </Wrapper>
    );
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
