import { ArrowForward, ArrowRight } from '@mui/icons-material';
import { Grid, IconButton, Link, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import { NavBar } from 'components/shared/shell/NavBar';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import { honeycomb } from 'styles/backgrounds';

export default function Shell({
  children
}: PropsWithChildren<{}>): JSX.Element {
  const theme = useTheme<Theme>();
  return (
    <Grid
      container
      flexDirection={'column'}
      flexWrap={'nowrap'}
      overflow={'auto'}
      sx={{
        position: 'absolute',
        inset: 0,
        background: honeycomb(
          theme.palette.grey[100],
          `${theme.palette.primary.light}1d`
        )
      }}
    >
      <NavBar />
      <Grid item flex={1} position={'relative'}>
        {children}
      </Grid>
    </Grid>
  );
}
