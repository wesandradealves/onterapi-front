import { AxiosError } from 'axios';
import { getApiErrorMessage } from './apiError';

const createAxiosError = (message: string, responseData?: unknown) => {
  const error = new AxiosError(message);
  if (responseData !== undefined) {
    (error as AxiosError).response = { data: responseData } as any;
  }
  return error;
};

describe('getApiErrorMessage', () => {
  const fallback = 'Falha';

  it('extrai primeira mensagem de array', () => {
    const error = createAxiosError('erro', { message: ['Primeira', 'Segunda'] });
    expect(getApiErrorMessage(error, fallback)).toBe('Primeira');
  });

  it('usa fallback quando primeiro item da lista e invalido', () => {
    const error = createAxiosError('erro', { message: [undefined] });
    expect(getApiErrorMessage(error, fallback)).toBe('Falha');
  });

  it('retorna mensagem quando string', () => {
    const error = createAxiosError('erro', { message: 'Mensagem' });
    expect(getApiErrorMessage(error, fallback)).toBe('Mensagem');
  });

  it('usa mensagem do erro Axios quando nao ha payload', () => {
    const error = createAxiosError('mensagem direta');
    expect(getApiErrorMessage(error, fallback)).toBe('mensagem direta');
  });

  it('usa mensagem de erro padrao quando for Error comum', () => {
    expect(getApiErrorMessage(new Error('custom'), fallback)).toBe('custom');
  });

  it('retorna fallback quando nao reconhecido', () => {
    expect(getApiErrorMessage({}, fallback)).toBe(fallback);
  });
});
