import texts from '../assets/content/texts.json';

export type AppLocale = keyof typeof texts;

export const getTexts = <TPath extends string>(path: TPath, locale: AppLocale = 'pt') => {
  const segments = path.split('.');
  let current: unknown = texts[locale];

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      throw new Error(`Texto nao encontrado para o caminho "${path}".`);
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current as ExtractLocaleValue<(typeof texts)[AppLocale], TPath>;
};

type ExtractLocaleValue<T, Path extends string> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? ExtractLocaleValue<T[Key], Rest>
    : never
  : Path extends keyof T
    ? T[Path]
    : never;
