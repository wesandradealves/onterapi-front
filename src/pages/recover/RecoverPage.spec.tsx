import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RecoverPage from './index';

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

jest.mock('../../features/auth/components/AuthForm/RecoverForm', () => ({
  __esModule: true,
  default: () => <div>Recover form</div>
}));

describe('RecoverPage', () => {
  it('renderiza template de recuperacao', () => {
    render(<RecoverPage />);
    expect(screen.getByText(/Recuperar acesso/i)).toBeInTheDocument();
    expect(screen.getByText(/Recover form/i)).toBeInTheDocument();
  });
});
