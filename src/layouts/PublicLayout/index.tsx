import { useRouter } from 'next/router';
import Seo from '../../components/atoms/Seo';
import type { SeoProps } from '../../components/atoms/Seo/interfaces';
import { resolveSeoEntry } from '../../routes';
import { getTexts } from '../../utils/texts';
import { PublicLayoutProps } from './interfaces';
import { containerClass, contentWrapperClass } from './styles';

const trimTrailingSlash = (value: string) => (value.endsWith('/') ? value.slice(0, -1) : value);
const sanitizeCanonicalPath = (path?: string) => {
  if (!path) {
    return '';
  }
  const [clean] = path.split('?');
  if (!clean) {
    return '';
  }
  return clean;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const router = useRouter();
  const { seoKey, overrides } = resolveSeoEntry(
    router.asPath ?? '',
    router.query ?? {},
    router.pathname ?? '/'
  );

  const baseSeo = getTexts(`seo.${seoKey}`) as SeoProps;
  const seo: SeoProps = {
    ...baseSeo,
    ...overrides
  };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const canonicalPath = sanitizeCanonicalPath(router.asPath ?? '');
  const canonical = siteUrl ? `${trimTrailingSlash(siteUrl)}${canonicalPath}` : undefined;

  return (
    <>
      <Seo title={seo.title} description={seo.description} canonical={canonical} />
      <div className={`${containerClass} relative overflow-hidden`}>
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute top-24 right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <main className={contentWrapperClass}>{children}</main>
      </div>
    </>
  );
};

export default PublicLayout;
