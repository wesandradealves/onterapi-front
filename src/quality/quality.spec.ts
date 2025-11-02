import { ESLint } from 'eslint';

describe('Codebase quality guard', () => {
  it('nao possui violacoes de lint e duplicidades criticas', async () => {
    const eslint = new ESLint({
      extensions: ['.ts', '.tsx'],
      useEslintrc: true,
      errorOnUnmatchedPattern: false,
      cache: false
    });

    const results = await eslint.lintFiles(['src/**/*.{ts,tsx}', 'pages/**/*.{ts,tsx}']);
    const errorResults = ESLint.getErrorResults(results);

    if (errorResults.length > 0) {
      const formatter = await eslint.loadFormatter('stylish');
      const output = formatter.format(errorResults);
      throw new Error(`Problemas de qualidade encontrados:\n${output}`);
    }
  });
});
