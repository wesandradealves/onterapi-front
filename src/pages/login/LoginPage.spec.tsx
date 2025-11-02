import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from './index';

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
    footer: React.ReactNode;
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
  it('renderiza template de autenticacao', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Login form/i)).toBeInTheDocument();
  });
});
