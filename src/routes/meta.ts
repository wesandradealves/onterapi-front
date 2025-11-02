import { ParsedUrlQuery } from 'querystring';
import type { SeoProps } from '../components/atoms/Seo/interfaces';

export interface RouteSeoEntry {
  pattern: RegExp;
  seoKey: string;
  buildOverrides?: (_context: {
    match: RegExpMatchArray | null;
    query: ParsedUrlQuery;
  }) => Partial<SeoProps>;
}

const sanitizePath = (path?: string) => {
  if (!path) {
    return '';
  }
  const [clean] = path.split('?');
  if (!clean) {
    return '';
  }
  return clean.toLowerCase();
};

const selectSanitizedPath = (primary?: string, fallback?: string) => {
  const primarySanitized = sanitizePath(primary);
  if (primarySanitized) {
    return primarySanitized;
  }

  return sanitizePath(fallback);
};

export const routeSeoEntries: RouteSeoEntry[] = [
  { pattern: /^\/login$/, seoKey: 'login' },
  { pattern: /^\/recover(?:\/[^/?]+)?$/, seoKey: 'recover' },
  { pattern: /^\/two-factor(?:\/[^/?]+)?$/, seoKey: 'twoFactor' }
];

export const resolveSeoEntry = (
  path: string,
  query: ParsedUrlQuery,
  fallbackPath?: string
): { seoKey: string; overrides: Partial<SeoProps> } => {
  const sanitized = selectSanitizedPath(path, fallbackPath);
  const entry = routeSeoEntries.find(route => route.pattern.test(sanitized));

  if (!entry) {
    return { seoKey: 'default', overrides: {} };
  }

  const match = sanitized.match(entry.pattern);
  const overrides = entry.buildOverrides ? entry.buildOverrides({ match, query }) : {};

  return {
    seoKey: entry.seoKey,
    overrides
  };
};
