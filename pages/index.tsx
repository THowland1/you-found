import { Typography } from '@material-ui/core';
import { NavBar } from 'components/shared/shell/NavBar';
import Head from 'next/head';
import React from 'react';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Typography variant="h1" color="textPrimary">
        Home
      </Typography>
    </div>
  );
}
