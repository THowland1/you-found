import axios from 'axios';
import ItemForm from 'components/items/ItemForm';
import { getItemById } from 'data-layer/getItemById';
import { getItemByItemSlug } from 'data-layer/getItemByItemSlug';
import { INewItem } from 'models/new-item';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { z } from 'zod';

type ServerSideProps = { item: IItem };

const ItemEditPage: NextPage<ServerSideProps> = ({ item }) => {
  const router = useRouter();
  const postNewItem = async (values: INewItem) => {
    await axios.put(`/api/items/${item.itemSlug}`, values);
    await router.push(`/_/items`);
  };

  return (
    <>
      <Head>
        <title>Update code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default ItemEditPage;

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
