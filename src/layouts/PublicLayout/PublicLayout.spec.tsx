import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PublicLayout from './index';

describe('PublicLayout', () => {
  it('renderiza conteudo dentro do wrapper', () => {
    render(
      <PublicLayout>
        <div>Conteudo</div>
      </PublicLayout>
    );

    expect(screen.getByText('Conteudo')).toBeInTheDocument();
  });
});
