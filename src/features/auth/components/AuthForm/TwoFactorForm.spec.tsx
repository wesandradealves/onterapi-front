import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TwoFactorForm from './TwoFactorForm';
import { validateTwoFactor } from '../../services/authApi';
import { applyAuthenticatedSession } from '../../services/authSession';
import { authStorage } from '../../services/authStorage';

const replaceMock = jest.fn();

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

jest.mock('next/router', () => ({
  useRouter: () => ({ replace: replaceMock })
}));

jest.mock('../../services/authApi', () => ({
  validateTwoFactor: jest.fn()
}));

jest.mock('../../services/authSession', () => ({
  applyAuthenticatedSession: jest.fn(),
  persistTempToken: jest.fn()
}));

jest.mock('../../services/authStorage', () => ({
  authStorage: {
    loadTempToken: jest.fn().mockReturnValue('temp-token'),
    saveTokens: jest.fn(),
    saveTempToken: jest.fn(),
    clearTokens: jest.fn(),
    clearTempToken: jest.fn()
  }
}));

describe('TwoFactorForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const submit = () =>
    fireEvent.click(
      screen.getByRole('button', {
        name: name => normalize(name).includes('validar codigo')
      })
    );

  it('valida codigo e aplica sessao', async () => {
    (validateTwoFactor as jest.Mock).mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 900,
      user: {
        id: '1',
        email: 'user@example.com',
        role: 'PROFESSIONAL'
      }
    });

    render(<TwoFactorForm />);

    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '123456' } });
    submit();

    await waitFor(() => expect(applyAuthenticatedSession).toHaveBeenCalled());
    expect(replaceMock).toHaveBeenCalledWith('/dashboard');
  });

  it('exibe erro quando codigo invalido', async () => {
    (validateTwoFactor as jest.Mock).mockRejectedValue(new Error('Codigo invalido.'));

    render(<TwoFactorForm />);

    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '123456' } });
    submit();

    await waitFor(() => expect(screen.getByText(/codigo invalido/i)).toBeInTheDocument());
  });

  it('redireciona para login quando nao ha temp token', () => {
    (authStorage.loadTempToken as jest.Mock).mockReturnValueOnce(null);
    render(<TwoFactorForm />);
    expect(replaceMock).toHaveBeenCalledWith('/login');
  });

  it('mostra mensagens de validacao quando campo vazio', async () => {
    render(<TwoFactorForm />);

    submit();

    await waitFor(() => expect(screen.getByText('Informe o codigo recebido.')).toBeInTheDocument());
  });
});
