import { Email, Phone, Sms, WhatsApp } from '@mui/icons-material';
import { Button, Grid, Link, Typography, useTheme } from '@mui/material';
import LandingPage from 'components/items/LandingPage';
import { getItemByItemSlug } from 'data-layer/getItemByItemSlug';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { honeycomb } from 'styles/backgrounds';
import { z } from 'zod';

type ServerSideProps = { item: IItem };
const ItemPage: NextPage<ServerSideProps> = ({ item }) => {
  const theme = useTheme();
  return (
    <>
      <LandingPage item={item} />
    </>
  );
};

export default ItemPage;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query
}) => {
  const itemSlug = z.string().parse(query.itemSlug);
  const item = await getItemByItemSlug(itemSlug);

  if (item) {
    return { props: { item } };
  } else {
    return {
      redirect: { destination: '404', statusCode: 404, permanent: false },
      props: {}
    };
  }
};
