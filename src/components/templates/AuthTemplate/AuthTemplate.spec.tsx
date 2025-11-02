import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AuthTemplate from './index';

describe('AuthTemplate', () => {
  it('renderiza heading, subtitulo e formulario', () => {
    render(
      <AuthTemplate
        heading="Titulo"
        subtitle="Descricao"
        form={<div>Formulario</div>}
        footer={<div>Rodape</div>}
        localeSwitcher={<div>Locale</div>}
        topAction={<button type="button">Ajuda</button>}
      />
    );

    expect(screen.getByText('Titulo')).toBeInTheDocument();
    expect(screen.getByText('Descricao')).toBeInTheDocument();
    expect(screen.getByText('Formulario')).toBeInTheDocument();
    expect(screen.getByText('Rodape')).toBeInTheDocument();
    expect(screen.getByText('Locale')).toBeInTheDocument();
    expect(screen.getByText('Ajuda')).toBeInTheDocument();
  });

  it('omite elementos opcionais quando nao informados', () => {
    const { queryByText } = render(
      <AuthTemplate heading="Titulo" subtitle="Descricao" form={<div>Formulario</div>} />
    );

    expect(queryByText('Rodape')).not.toBeInTheDocument();
  });
});
