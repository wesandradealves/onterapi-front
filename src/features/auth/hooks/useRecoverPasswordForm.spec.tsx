import { act, renderHook } from '@testing-library/react';
import { useRecoverPasswordForm } from './useRecoverPasswordForm';
import { requestPasswordReset } from '../services/authApi';

const pushMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ push: pushMock, replace: jest.fn() })
}));

jest.mock('../services/authApi', () => ({
  requestPasswordReset: jest.fn()
}));

describe('useRecoverPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('define mensagem padrao quando sucesso sem mensagem customizada', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValue({ delivered: true });

    const { result } = renderHook(() => useRecoverPasswordForm());

    await act(async () => {
      await result.current.onSubmit(new Event('submit'));
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.serverMessage).toBe('Se o email existir, enviaremos as instrucoes.');
    expect(result.current.hasError).toBe(false);
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('usa mensagem personalizada quando backend fornece mensagem', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValue({
      delivered: true,
      message: 'Verifique sua caixa de entrada.'
    });

    const { result } = renderHook(() => useRecoverPasswordForm());

    await act(async () => {
      await result.current.onSubmit(new Event('submit'));
    });

    expect(result.current.serverMessage).toBe('Verifique sua caixa de entrada.');
    expect(result.current.hasError).toBe(false);
  });

  it('define erro quando falha', async () => {
    (requestPasswordReset as jest.Mock).mockRejectedValue(new Error('Falhou'));

    const { result } = renderHook(() => useRecoverPasswordForm());

    await act(async () => {
      await result.current.onSubmit(new Event('submit'));
    });

    expect(result.current.serverMessage).toBe('Falhou');
    expect(result.current.hasError).toBe(true);
  });
});
