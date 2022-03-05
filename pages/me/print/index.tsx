import { Theme, useTheme } from '@mui/material';
import PrintForm from 'components/PrintForm';
import Shell from 'components/shared/shell';
import { getItemsByFirebaseUserId } from 'data-layer/getItemsByFirebaseUserId';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import React from 'react';
import * as NS from 'utils/next-serialise';
import { z } from 'zod';

type ServerSideProps = NS.Serialized<{ items: IItem[]; baseUrl: string }>;

const ItemEditPage: NextPage<ServerSideProps> = props => {
  const { items, baseUrl } = NS.deserialize(props);
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
        <PrintForm items={items as IItem[]} baseUrl={baseUrl} />
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
    };
  }
  const token = tokenAttempt.token;

  const items = await getItemsByFirebaseUserId(token.uid!);

  if (items) {
    return { props: NS.serialize({ items, baseUrl }) };
  } else {
    return {
      redirect: { destination: '404', statusCode: 301 }
    } as const;
  }
};
