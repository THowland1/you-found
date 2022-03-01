import { Email, Phone, Sms, WhatsApp } from '@mui/icons-material';
import { Button, Grid, Link, Typography, useTheme } from '@mui/material';
import LandingPage from 'components/items/LandingPage';
import { addItemEventByItemSlug } from 'data-layer/addItemEventByItemSlug';
import { getItemByItemSlug } from 'data-layer/getItemByItemSlug';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { honeycomb } from 'styles/backgrounds';
import { z } from 'zod';
import * as NS from 'utils/next-serialise';

type ServerSideProps = { item: IItem };
const ItemPage: NextPage<NS.Serialized<ServerSideProps>> = ({
  item: serialisedItem
}) => {
  const item = NS.deserialize<IItem>(serialisedItem);

  return (
    <>
      <LandingPage item={item} />
    </>
  );
};

export default ItemPage;

export const getServerSideProps: GetServerSideProps<
  NS.Serialized<ServerSideProps>
> = async ({ query }) => {
  const itemSlug = z.string().parse(query.itemSlug);
  const item = await getItemByItemSlug(itemSlug);

  await addItemEventByItemSlug(itemSlug, {
    eventType: 'Visited',
    datetime: new Date()
  });

  if (item) {
    return { props: NS.serialize({ item }) };
  } else {
    return {
      redirect: { destination: '404', statusCode: 404, permanent: false },
      props: {}
    };
  }
};
