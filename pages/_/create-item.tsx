import CreateItemsNames from 'components/create-items/01-names/names';
import CreateItemsUser from 'components/create-items/02-user/user';
import CreateItemsContactMethods from 'components/create-items/03-contact-methods/contact-methods';
import CreateItemsPageDesigners from 'components/create-items/04-page-designers/page-designers';
import CreateItemsSuccess from 'components/create-items/06-success/success';
import { Form } from 'components/create-items/form';
import { Step } from 'components/create-items/step';
import React, { useState } from 'react';
import Head from 'next/head';
import CreateItemsConfirm from 'components/create-items/05-confirm/confirm';
import LogoPortrait from 'public/logo-landscape.svg';
import { makeStyles, Theme } from '@material-ui/core';

// TODO Add ability to go back (and repopulate forms)
const useStyles = makeStyles((theme: Theme) => ({
  page: {
    flexDirection: 'column'
  },
  // header: {

  // },
  container: {
    flexDirection: 'row',
    '& label': {
      marginRight: theme.spacing(8)
    }
  },
  root: { color: theme.palette.secondary.main }
}));

export default function CreateItemPage() {
  const [form, setForm] = useState(new Form());

  const main = GetMainPageContent(form, setForm);

  return (
    <>
      <Head>
        <title>Create QR Codes</title>
      </Head>
      {main}
      <div>
        <LogoPortrait />
      </div>
    </>
  );
}

function GetMainPageContent(form: Form, setForm: React.Dispatch<Form>) {
  switch (form.step) {
    case Step.Names:
      return <CreateItemsNames form={form} setForm={setForm} />;
    case Step.User:
      return <CreateItemsUser form={form} setForm={setForm} />;
    case Step.ContactMethods:
      return <CreateItemsContactMethods form={form} setForm={setForm} />;
    case Step.PageDesigners:
      return <CreateItemsPageDesigners form={form} setForm={setForm} />;
    case Step.Confirm:
      return <CreateItemsConfirm form={form} setForm={setForm} />;
    case Step.Success:
      return <CreateItemsSuccess form={form} setForm={setForm} />;
    default:
      throw new TypeError('This is not a step on the form');
  }
}
