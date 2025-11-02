import { getTexts } from './texts';

describe('getTexts utility', () => {
  it('retorna texto existente', () => {
    expect(getTexts('auth.login.emailLabel')).toBe('Email ou celular');
  });

  it('lança erro para caminho invalido', () => {
    expect(() => getTexts('auth.inexistente')).toThrow(
      'Texto nao encontrado para o caminho "auth.inexistente".'
    );
  });
});
