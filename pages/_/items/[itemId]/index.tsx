import axios from 'axios';
import ItemForm from 'components/items/ItemForm';
import { getItemById } from 'data-layer/getItemById';
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
    await axios.put(`/api/items/${(item as any).id}`, values);
    await router.push(`/_/items`);
  };

  return (
    <>
      <Head>
        <title>Update code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ItemForm initialValues={item} onSubmit={postNewItem} />
    </>
  );
};

export default ItemEditPage;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query
}) => {
  console.log(query);
  const itemId = z.string().parse(query.itemId);
  const item = await getItemById(itemId);

  console.log(item);
  if (item) {
    return { props: { item } };
  } else {
    return {
      redirect: { destination: '404', statusCode: 404, permanent: false },
      props: {}
    };
  }
};
