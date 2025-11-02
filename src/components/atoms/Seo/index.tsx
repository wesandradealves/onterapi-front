import Head from 'next/head';
import { SeoProps } from './interfaces';

const siteName = 'OnTerapi';

const Seo = ({ title, description, canonical }: SeoProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} key="description" />
    <meta property="og:title" content={title} key="og:title" />
    <meta property="og:description" content={description} key="og:description" />
    <meta property="og:type" content="website" key="og:type" />
    <meta property="og:site_name" content={siteName} key="og:site_name" />
    <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
    <meta name="twitter:title" content={title} key="twitter:title" />
    <meta name="twitter:description" content={description} key="twitter:description" />
    <meta name="robots" content="index,follow" key="robots" />
    {canonical ? <link rel="canonical" href={canonical} key="canonical" /> : null}
  </Head>
);

export default Seo;
