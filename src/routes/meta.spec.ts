import { resolveSeoEntry, routeSeoEntries } from './meta';

describe('resolveSeoEntry', () => {
  it('retorna default quando nenhuma rota corresponde', () => {
    const result = resolveSeoEntry('/unknown', {});
    expect(result).toEqual({ seoKey: 'default', overrides: {} });
  });

  it('normaliza caminho vazio retornando default', () => {
    const result = resolveSeoEntry('', {});
    expect(result).toEqual({ seoKey: 'default', overrides: {} });
  });

  it('ignora caminhos compostos apenas por query string', () => {
    const result = resolveSeoEntry('?utm=1', {});
    expect(result).toEqual({ seoKey: 'default', overrides: {} });
  });

  it('utiliza fallback quando o caminho principal nao casa', () => {
    const result = resolveSeoEntry('?utm=1', {}, '/two-factor');
    expect(result).toEqual(
      expect.objectContaining({
        seoKey: 'twoFactor'
      })
    );
  });

  it('identifica rotas com segmentos dinamicos', () => {
    const result = resolveSeoEntry('/two-factor/challenge', {});
    expect(result).toEqual(
      expect.objectContaining({
        seoKey: 'twoFactor'
      })
    );
  });

  it('concatena overrides dinamicos quando fornecidos', () => {
    const dynamicEntryIndex = routeSeoEntries.push({
      pattern: /^\/dinamico\/[^/]+$/,
      seoKey: 'default',
      buildOverrides: ({ query }) => {
        const candidate = (query as Record<string, unknown>).title;
        return {
          title: typeof candidate === 'string' ? candidate : 'Dinamico'
        };
      }
    });

    const result = resolveSeoEntry('/dinamico/teste', { title: 'Titulo Custom' });
    expect(result).toEqual({
      seoKey: 'default',
      overrides: { title: 'Titulo Custom' }
    });

    routeSeoEntries.splice(dynamicEntryIndex - 1, 1);
  });
});
