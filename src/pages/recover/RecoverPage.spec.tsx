import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import RecoverPage from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/recover', asPath: '/recover' })
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

jest.mock('../../features/auth/components/AuthForm/RecoverForm', () => ({
  __esModule: true,
  default: () => <div>Recover form</div>
}));

describe('RecoverPage', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('renderiza template de recuperacao com SEO adequado', async () => {
    render(<RecoverPage />);
    expect(screen.getByRole('heading', { name: /Recuperar acesso/i })).toBeInTheDocument();
    expect(screen.getByText(/Recover form/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(document.querySelector('title')).toHaveTextContent('Recuperar acesso | OnTerapi')
    );
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute(
      'content',
      'Solicite a redefinicao de senha para recuperar rapidamente o acesso a plataforma OnTerapi.'
    );
  });
});
