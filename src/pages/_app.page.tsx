import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import '../styles/global.scss';
import '../lib/fontawesome';
import Seo from '../components/atoms/Seo';
import type { SeoProps } from '../components/atoms/Seo/interfaces';
import { store } from '../store';
import { muiTheme } from '../lib/theme';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
import LoadingOverlay from '../components/organisms/LoadingOverlay';
import { useInitializeSession } from '../features/auth/hooks/useInitializeSession';
import { getTexts } from '../utils/texts';

const App = ({ Component, pageProps, router }: AppProps) => {
  useInitializeSession();
  useAuthGuard();
  const isLoading = useGlobalLoading();
  const defaultSeo = getTexts('seo.default') as SeoProps;

  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="application-name" content="OnTerapi" />
          <link rel="icon" href="/icons/icon-192.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <Seo title={defaultSeo.title} description={defaultSeo.description} />
        <CssBaseline />
        <Component key={router.route} {...pageProps} />
        <LoadingOverlay isVisible={isLoading} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
