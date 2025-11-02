import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import TwoFactorPage from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/two-factor', asPath: '/two-factor' })
}));

jest.mock('../../features/auth/components/AuthForm/TwoFactorForm', () => {
  const MockTwoFactorForm = () => <div data-testid="two-factor-form" />;
  MockTwoFactorForm.displayName = 'MockTwoFactorForm';
  return MockTwoFactorForm;
});

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

describe('TwoFactorPage', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('renderiza template de two factor com SEO', async () => {
    render(<TwoFactorPage />);
    expect(
      screen.getByText(content => normalize(content).includes('validacao em duas etapas'))
    ).toBeInTheDocument();
    expect(screen.getByTestId('two-factor-form')).toBeInTheDocument();

    await waitFor(() =>
      expect(document.querySelector('title')).toHaveTextContent('Verificacao em duas etapas | OnTerapi')
    );
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute(
      'content',
      'Informe o codigo enviado para confirmar sua identidade e concluir o login com seguranca.'
    );
  });
});
