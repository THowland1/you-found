import { RemoveCircleOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  Theme,
  Typography,
  useTheme
} from '@mui/material';
import FormikTextField from 'components/fields/FormikTextField';
import Shell from 'components/shared/shell';
import { getItemById } from 'data-layer/getItemById';
import { FieldArray, Formik, useField } from 'formik';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import StickerSheetPreview from 'components/StickerSheetPreview';
import nookies from 'nookies';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { getItemsByEmailAddress } from 'data-layer/getItemsByEmailAddress';
import { Dump } from 'components/shared/Dump';
import { v4 } from 'uuid';
import FormikSelectField from 'components/fields/FormikSelectField';
import PrintForm from 'components/PrintForm';

type ServerSideProps = { items: IItem[]; baseUrl: string };

const ItemEditPage: NextPage<ServerSideProps> = ({ items, baseUrl }) => {
  const theme = useTheme<Theme>();

  if (!items.length) {
    return <p>You do not have any items</p>;
  }

  return (
    <>
      <Head>
        <title>Print QR code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell>
        <PrintForm items={items} baseUrl={baseUrl} />
      </Shell>
    </>
  );
};

export default ItemEditPage;

async function tryVerifyIdToken(idToken: string) {
  try {
    const token = await firebaseAdmin.auth().verifyIdToken(idToken);
    return { success: true, token } as const;
  } catch {
    return { success: false } as const;
  }
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async ctx => {
  const cookies = nookies.get(ctx);
  const baseUrl = z.string().url().parse(process.env.ORIGIN);

  const tokenAttempt = await tryVerifyIdToken(cookies.token);
  if (!tokenAttempt.success) {
    return {
      redirect: {
        destination: `/auth/refresh?redirecturl=/me/print`,
        permanent: false
      }
    } as const;
  }
  const token = tokenAttempt.token;

  const items = await getItemsByEmailAddress(token.email!);

  if (items) {
    return { props: { items, baseUrl } } as const;
  } else {
    return {
      redirect: { destination: '404', statusCode: 301 }
    } as const;
  }
};
