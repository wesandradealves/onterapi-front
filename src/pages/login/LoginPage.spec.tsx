import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/login', asPath: '/login' })
}));

jest.mock('../../components/templates/AuthTemplate', () => ({
  __esModule: true,
  default: ({
    heading,
    subtitle,
    form,
    footer
  }: {
    heading: string;
    subtitle: string;
    form: React.ReactNode;
    footer?: React.ReactNode;
  }) => (
    <div>
      <h1>{heading}</h1>
      <p>{subtitle}</p>
      <div>{form}</div>
      <div>{footer}</div>
    </div>
  )
}));

jest.mock('../../features/auth/components/AuthForm/LoginForm', () => ({
  __esModule: true,
  default: () => <div>Login form</div>
}));

describe('LoginPage', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('renderiza template de autenticacao e SEO basico', async () => {
    render(<LoginPage />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Login form/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(document.querySelector('title')).toHaveTextContent('Entrar | OnTerapi')
    );
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute(
      'content',
      'Acesse o painel OnTerapi para acompanhar pacientes, agenda, equipe e fluxos terapeuticos com seguranca.'
    );
  });
});
