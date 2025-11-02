import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './index';

describe('Button atom', () => {
  it('renderiza label e dispara evento de clique', () => {
    const handler = jest.fn();
    render(<Button label="Enviar" onClick={handler} />);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(handler).toHaveBeenCalled();
  });

  it('aplica classes extras e respeita disabled explicito', () => {
    const { container } = render(<Button label="Enviar" className="extra" disabled />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('extra');
    expect(button).toBeDisabled();
  });

  it('mostra spinner quando loading', () => {
    render(<Button label="Salvar" isLoading />);
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });
});
