import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import LoginForm from './LoginForm';
import { useSignInForm } from '../../hooks/useSignInForm';

jest.mock('../../hooks/useSignInForm');

const createHookReturn = (
  overrides: Partial<ReturnType<typeof useSignInForm>> = {}
): ReturnType<typeof useSignInForm> => {
  const { result } = renderHook(() =>
    useForm({
      defaultValues: {
        email: '',
        password: ''
      }
    })
  );

  return {
    form: result.current,
    onSubmit: jest.fn(),
    serverError: null,
    isSubmitting: false,
    ...overrides
  };
};

describe('LoginForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza campos e labels corretos', () => {
    const hookReturn = createHookReturn();
    (useSignInForm as jest.Mock).mockReturnValue(hookReturn);

    render(<LoginForm />);

    expect(screen.getByLabelText('Email ou celular')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('aciona submit do hook ao enviar formulario', async () => {
    const handleSubmit = jest.fn();
    const hookReturn = createHookReturn({ onSubmit: handleSubmit });
    (useSignInForm as jest.Mock).mockReturnValue(hookReturn);

    render(<LoginForm />);

    fireEvent.submit(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
  });

  it('exibe mensagem de erro do servidor', () => {
    const hookReturn = createHookReturn({ serverError: 'Credenciais invalidas.' });
    (useSignInForm as jest.Mock).mockReturnValue(hookReturn);

    render(<LoginForm />);

    expect(screen.getByText('Credenciais invalidas.')).toBeInTheDocument();
  });

  it('permite alternar visibilidade da senha', () => {
    const hookReturn = createHookReturn();
    (useSignInForm as jest.Mock).mockReturnValue(hookReturn);

    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    fireEvent.click(screen.getByLabelText('Mostrar senha'));
    expect(passwordInput.type).toBe('text');

    fireEvent.click(screen.getByLabelText('Ocultar senha'));
    expect(passwordInput.type).toBe('password');
  });

  it('mostra erros de validacao quando presentes', () => {
    const hookReturn = createHookReturn();
    let currentReturn = hookReturn;
    (useSignInForm as jest.Mock).mockImplementation(() => currentReturn);

    const { rerender } = render(<LoginForm />);

    currentReturn = {
      ...hookReturn,
      form: {
        ...hookReturn.form,
        formState: {
          ...hookReturn.form.formState,
          errors: {
            email: { message: 'Email invalido.' },
            password: { message: 'Informe sua senha.' }
          }
        }
      }
    };

    rerender(<LoginForm />);

    expect(screen.getByText('Email invalido.')).toBeInTheDocument();
    expect(screen.getByText('Informe sua senha.')).toBeInTheDocument();
  });
});
