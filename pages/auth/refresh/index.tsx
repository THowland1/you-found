import {
  Box,
  CircularProgress,
  Stack,
  Theme,
  Typography,
  useTheme
} from '@mui/material';
import { useAuth } from 'components/shared/auth/useAuth';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useAuthService } from 'utils/hooks/useAuthService';
import { z } from 'zod';

const REDIRECT_URL_QUERY_PARAM = 'redirecturl';

const RefreshPage: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState('Refreshing the auth token');
  const [error, setError] = useState<string | null>();
  const { logout } = useAuthService();
  const theme = useTheme<Theme>();
  useEffect(() => {
    if (user) {
      const redirectUriOrNull = z
        .string()
        .safeParse(router.query[REDIRECT_URL_QUERY_PARAM]);
      if (redirectUriOrNull.success) {
        const redirectUri = redirectUriOrNull.data;
        setStatus(`Redirecting to ${redirectUri}`);
        router.push(redirectUri);
      } else {
        setError(
          `Cannot redirect: ${REDIRECT_URL_QUERY_PARAM} must be a string`
        );
      }
    } else {
      setStatus('Refreshing the auth token');
    }
  }, [user]);

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Stack gap="3rem">
          {error ? (
            <Typography variant="body1" color={theme.palette.error.main}>
              {error}
            </Typography>
          ) : (
            <>
              <CircularProgress size="3rem" sx={{ margin: 'auto' }} />
              {status && <Typography variant="body1">{status}</Typography>}
            </>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default RefreshPage;
