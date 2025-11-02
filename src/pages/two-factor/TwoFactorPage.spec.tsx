import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TwoFactorPage from './index';

jest.mock('../../features/auth/components/AuthForm/TwoFactorForm', () => () => <div data-testid="two-factor-form" />);

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

describe('TwoFactorPage', () => {
  it('renderiza template de two factor', () => {
    render(<TwoFactorPage />);
    expect(
      screen.getByText(content => normalize(content).includes('validacao em duas etapas'))
    ).toBeInTheDocument();
    expect(screen.getByTestId('two-factor-form')).toBeInTheDocument();
  });
});
