import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import '../styles/global.scss';
import '../lib/fontawesome';
import { store } from '../store';
import { muiTheme } from '../lib/theme';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
import LoadingOverlay from '../components/organisms/LoadingOverlay';
import { useInitializeSession } from '../features/auth/hooks/useInitializeSession';

const App = ({ Component, pageProps, router }: AppProps) => {
  useInitializeSession();
  useAuthGuard();
  const isLoading = useGlobalLoading();

  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Component key={router.route} {...pageProps} />
        <LoadingOverlay isVisible={isLoading} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
