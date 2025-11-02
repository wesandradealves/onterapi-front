import { act, renderHook } from '@testing-library/react';
import { useSignInForm } from './useSignInForm';
import { signIn } from '../services/authApi';
import { applyAuthenticatedSession, persistTempToken } from '../services/authSession';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('../services/authApi', () => ({
  signIn: jest.fn()
}));

jest.mock('../services/authSession', () => ({
  applyAuthenticatedSession: jest.fn(),
  persistTempToken: jest.fn()
}));

const pushMock = jest.fn();
const replaceMock = jest.fn();

describe('useSignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('next/router').useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      replace: replaceMock
    });
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const submit = async (hook: ReturnType<typeof useSignInForm>) => {
    await act(async () => {
      await hook.onSubmit(new Event('submit'));
    });
  };

  it('envia para two-factor quando necessario', async () => {
    (signIn as jest.Mock).mockResolvedValue({ requiresTwoFactor: true, tempToken: 'temp' });

    const { result } = renderHook(() => useSignInForm());

    await submit(result.current);

    expect(persistTempToken).toHaveBeenCalledWith('temp');
    expect(pushMock).toHaveBeenCalledWith('/two-factor');
  });

  it('aplica sessao quando tokens recebidos com expires informado', async () => {
    (signIn as jest.Mock).mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 1200,
      user: { id: '1', email: 'user@example.com', role: 'PROFESSIONAL' }
    });

    const { result } = renderHook(() => useSignInForm());
    act(() => {
      result.current.form.setValue('email', 'user@example.com');
      result.current.form.setValue('password', 'Senha123');
    });

    await submit(result.current);

    expect(applyAuthenticatedSession).toHaveBeenCalledWith(
      expect.objectContaining({
        expiresAt: new Date('2025-01-01T00:00:00Z').getTime() + 1200 * 1000,
        user: expect.objectContaining({ role: 'PROFESSIONAL' })
      })
    );
    expect(replaceMock).toHaveBeenCalledWith('/dashboard');
  });

  it('usa valores padrao quando backend nao envia expires ou role', async () => {
    (signIn as jest.Mock).mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
      user: { id: '1', email: 'user@example.com' }
    });

    const { result } = renderHook(() => useSignInForm());

    await submit(result.current);

    expect(applyAuthenticatedSession).toHaveBeenCalledWith(
      expect.objectContaining({
        expiresAt: new Date('2025-01-01T00:00:00Z').getTime() + 900 * 1000,
        user: expect.objectContaining({ role: '' })
      })
    );
  });

  it('define erro quando resposta inesperada', async () => {
    (signIn as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useSignInForm());

    await submit(result.current);

    expect(result.current.serverError).toBe('Resposta inesperada do servidor.');
  });

  it('usa fallback padrao quando request falha sem mensagem', async () => {
    (signIn as jest.Mock).mockRejectedValue({});

    const { result } = renderHook(() => useSignInForm());

    await submit(result.current);

    expect(result.current.serverError).toBe('Nao foi possivel entrar. Tente novamente.');
  });
});
