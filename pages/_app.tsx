import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../styles/theme';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import { AuthProvider } from 'components/shared/auth/AuthProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <CssBaseline />
            <Component {...pageProps} />
          </AuthProvider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
