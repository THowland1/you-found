import { ArrowForward, ArrowRight } from '@mui/icons-material';
import { Grid, IconButton, Link, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import { NavBar } from 'components/shared/shell/NavBar';
import Head from 'next/head';
import React from 'react';
import { honeycomb } from 'styles/backgrounds';

export default function Home() {
  const theme = useTheme();
  return (
    <Grid
      sx={{
        position: 'absolute',
        inset: 0,
        background: honeycomb(
          theme.palette.background.default,
          `${theme.palette.primary.dark}09`
        )
      }}
    >
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Grid
        container
        maxWidth="sm"
        margin={'auto'}
        paddingX={{ xs: '1rem', sm: '2rem' }}
        paddingY={'2rem'}
        flexDirection="column"
        gap="2rem"
      >
        <Typography variant="h2" color="textPrimary">
          Welcome to YouFound
        </Typography>
        <Link underline="none" href="/_/new" color={'textPrimary'}>
          <Grid
            container
            sx={{
              background: theme.palette.background.default,
              padding: '1rem',
              border: `solid 1px ${theme.palette.grey[300]}`,
              borderRadius: '.5rem',
              boxShadow: theme.shadows[1],
              '&:hover': {
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Grid xs item>
              <Typography variant="h4">Register a new code</Typography>
              <Typography variant="body1" color="GrayText">
                Sign yourself up to be contacted if someone finds your stuff
              </Typography>
            </Grid>
            <Grid item>
              <IconButton>
                <ArrowForward />
              </IconButton>
            </Grid>
          </Grid>
        </Link>
      </Grid>
    </Grid>
  );
}
