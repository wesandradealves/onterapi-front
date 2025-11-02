import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecoverForm from './RecoverForm';
import { requestPasswordReset } from '../../services/authApi';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const pushMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ push: pushMock, replace: jest.fn() })
}));

jest.mock('../../services/authApi', () => ({
  requestPasswordReset: jest.fn()
}));

describe('RecoverForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const submit = () =>
    fireEvent.click(
      screen.getByRole('button', {
        name: name => normalize(name).includes('enviar instrucoes')
      })
    );

  it('envia instrucoes de recuperacao com mensagem padrao', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValue({ delivered: true });

    render(<RecoverForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    submit();

    await waitFor(() =>
      expect(
        screen.getByText(text => normalize(text).includes('se o email existir, enviaremos as instrucoes'))
      ).toBeInTheDocument()
    );
  });

  it('usa mensagem personalizada do backend quando disponivel', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValue({
      delivered: true,
      message: 'Verifique seu email.'
    });

    render(<RecoverForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    submit();

    await waitFor(() => expect(screen.getByText('Verifique seu email.')).toBeInTheDocument());
  });

  it('exibe erro quando API falha', async () => {
    (requestPasswordReset as jest.Mock).mockRejectedValue(new Error('erro'));

    render(<RecoverForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    submit();

    await waitFor(() => expect(screen.getByText('erro')).toBeInTheDocument());
  });

  it('mostra mensagem de validacao quando email ausente', async () => {
    render(<RecoverForm />);

    submit();

    await waitFor(() => expect(screen.getByText('Informe seu email.')).toBeInTheDocument());
  });
});
