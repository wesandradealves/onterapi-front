import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextField from './index';

describe('TextField atom', () => {
  it('renderiza label e aceita input', () => {
    const handleChange = jest.fn();
    render(<TextField label="Email" placeholder="email" onChange={handleChange} fullWidth={false} />);

    const input = screen.getByPlaceholderText('email');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('aceita className extra', () => {
    const { container } = render(<TextField label="Email" className="custom" />);
    expect(container.querySelector('input')).toHaveClass('custom');
  });

  it('renderiza leading icon', () => {
    const { container } = render(<TextField label="Email" leadingIcon={<MailOutlineIcon fontSize="small" />} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renderiza helper e mensagem de erro', () => {
    const { rerender } = render(<TextField label="Senha" helperText="Dica" />);
    expect(screen.getByText('Dica')).toBeInTheDocument();

    rerender(<TextField label="Senha" errorMessage="Obrigatorio" />);
    expect(screen.getByText('Obrigatorio')).toBeInTheDocument();
  });

  it('executa acao do icone a direita', () => {
    const handler = jest.fn();
    render(
      <TextField
        label="Senha"
        trailingIcon={<VisibilityIcon fontSize="small" />}
        trailingIconAction={handler}
        trailingIconButtonLabel="Mostrar"
      />
    );

    fireEvent.click(screen.getByLabelText('Mostrar'));
    expect(handler).toHaveBeenCalled();
  });

  it('renderiza icone estatico a direita', () => {
    const { container } = render(<TextField label="Busca" trailingIcon={<VisibilityIcon fontSize="small" />} />);
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0);
  });

  it('ajusta paddings quando icones presentes', () => {
    const { container } = render(
      <TextField
        label="Combinado"
        leadingIcon={<MailOutlineIcon fontSize="small" />}
        trailingIcon={<VisibilityIcon fontSize="small" />}
      />
    );
    const input = container.querySelector('input');
    expect(input?.className).toContain('pl-10');
    expect(input?.className).toContain('pr-12');
  });
});
