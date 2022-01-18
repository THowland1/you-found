import { ArrowForward, ArrowRight } from '@mui/icons-material';
import { Grid, IconButton, Link, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import Shell from 'components/shared/shell';
import { NavBar } from 'components/shared/shell/NavBar';
import Head from 'next/head';
import React from 'react';
import { honeycomb } from 'styles/backgrounds';

export default function Home() {
  const theme = useTheme<Theme>();
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell>
        <Grid
          container
          maxWidth="sm"
          margin={'auto'}
          paddingX={{ xs: '1rem', sm: '2rem' }}
          paddingY={'2rem'}
          gap={'2rem'}
          flexDirection="column"
        >
          <Typography variant="h2" color="textPrimary">
            Welcome to YouFound
          </Typography>
          <Section
            href="/_/new"
            h4Text="Register a new code"
            body1Text="Sign yourself up to be contacted if someone finds your stuff"
          />
          <Section
            href="/_/items"
            h4Text="See your codes"
            body1Text="Edit what people see when they scan your code(s) or check if they have been spotted"
          />
        </Grid>
      </Shell>
    </>
  );
}

export function Section({
  href,
  h4Text,
  body1Text
}: {
  href: string;
  h4Text: string;
  body1Text: string;
}): JSX.Element {
  const theme = useTheme<Theme>();

  return (
    <Link underline="none" href={href} color={'textPrimary'}>
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
          <Typography variant="h4">{h4Text}</Typography>
          <Typography variant="body1" color="GrayText">
            {body1Text}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton>
            <ArrowForward />
          </IconButton>
        </Grid>
      </Grid>
    </Link>
  );
}
