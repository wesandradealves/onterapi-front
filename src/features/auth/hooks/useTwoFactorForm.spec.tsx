import { act, renderHook } from '@testing-library/react';
import { useTwoFactorForm } from './useTwoFactorForm';
import { validateTwoFactor } from '../services/authApi';
import { applyAuthenticatedSession } from '../services/authSession';
import { authStorage } from '../services/authStorage';

const routerMock = { replace: jest.fn() };

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => routerMock)
}));

jest.mock('../services/authApi', () => ({
  validateTwoFactor: jest.fn()
}));

jest.mock('../services/authSession', () => ({
  applyAuthenticatedSession: jest.fn(),
  persistTempToken: jest.fn()
}));

jest.mock('../services/authStorage', () => ({
  authStorage: {
    loadTempToken: jest.fn().mockReturnValue('temp-token'),
    saveTokens: jest.fn(),
    saveTempToken: jest.fn(),
    clearTokens: jest.fn(),
    clearTempToken: jest.fn()
  }
}));

describe('useTwoFactorForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    routerMock.replace.mockClear();
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const triggerSubmit = async (hookResult: ReturnType<typeof useTwoFactorForm>) => {
    act(() => {
      hookResult.form.setValue('code', '123456');
    });

    await act(async () => {
      await hookResult.onSubmit(new Event('submit'));
    });
  };

  it('aplica sessao ao validar com sucesso utilizando expiresIn informado', async () => {
    (validateTwoFactor as jest.Mock).mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 1200,
      user: { id: '1', email: 'user@example.com', role: 'PROFESSIONAL' }
    });

    const { result } = renderHook(() => useTwoFactorForm());

    await triggerSubmit(result.current);

    expect(applyAuthenticatedSession).toHaveBeenCalledWith(
      expect.objectContaining({
        expiresAt: new Date('2025-01-01T00:00:00Z').getTime() + 1200 * 1000,
        user: expect.objectContaining({ role: 'PROFESSIONAL' })
      })
    );
    expect(routerMock.replace).toHaveBeenCalledWith('/dashboard');
  });

  it('usa expires padrao e role vazia quando backend nao informa valores', async () => {
    (validateTwoFactor as jest.Mock).mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
      user: { id: '1', email: 'user@example.com' }
    });

    const { result } = renderHook(() => useTwoFactorForm());

    await triggerSubmit(result.current);

    expect(applyAuthenticatedSession).toHaveBeenCalledWith(
      expect.objectContaining({
        expiresAt: new Date('2025-01-01T00:00:00Z').getTime() + 900 * 1000,
        user: expect.objectContaining({ role: '' })
      })
    );
  });

  it('define mensagem de erro padrao quando excecao nao possui mensagem', async () => {
    (validateTwoFactor as jest.Mock).mockRejectedValue({});

    const { result } = renderHook(() => useTwoFactorForm());

    await triggerSubmit(result.current);

    expect(result.current.serverError).toBe('Codigo invalido. Tente novamente.');
  });

  it('redireciona ao tentar enviar sem temp token em memoria', async () => {
    (authStorage.loadTempToken as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useTwoFactorForm());

    act(() => {
      result.current.form.setValue('code', '123456');
      routerMock.replace.mockClear();
    });

    await act(async () => {
      await result.current.onSubmit(new Event('submit'));
    });

    expect(routerMock.replace).toHaveBeenCalledWith('/login');
  });

  it('redireciona imediatamente quando nao ha temp token no carregamento', () => {
    (authStorage.loadTempToken as jest.Mock).mockReturnValueOnce(null);
    renderHook(() => useTwoFactorForm());
    expect(routerMock.replace).toHaveBeenCalledWith('/login');
  });
});
