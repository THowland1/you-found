import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps
} from '@mui/material';
import axios from 'axios';
import ItemForm from 'components/items/ItemForm';
import { INewItem } from 'models/new-item';
import { NextPage } from 'next';
import Head from 'next/head';

const initialValues: INewItem = {
  itemName: '',
  headline: '',
  message: '',
  phoneNumber: '',
  showWhatsAppLink: false,
  showPhoneCallLink: false,
  showSMSLink: false,

  emailAddress: '',
  showEmailLink: false
};

const NewPage: NextPage = () => {
  const postNewItem = async (values: INewItem) => {
    await axios.post('/api/items', values);
  };

  return (
    <>
      <Head>
        <title>Register new code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ItemForm initialValues={initialValues} onSubmit={postNewItem} />
    </>
  );
};

export default NewPage;
