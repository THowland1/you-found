import CreateItemsNames from 'components/create-items/01-names/names';
import CreateItemsUser from 'components/create-items/02-user/user';
import CreateItemsContactMethods from 'components/create-items/03-contact-methods/contact-methods';
import CreateItemsPageDesigners from 'components/create-items/04-page-designers/page-designers';
import { Form } from 'components/create-items/form';
import { Step } from 'components/create-items/step';
import React, { useState } from 'react';

// TODO Add ability to go back (and repopulate forms)

export default function CreateItemPage() {
  const [form, setForm] = useState(new Form());

  switch (form.step) {
    case Step.Names:
      return <CreateItemsNames form={form} setForm={setForm} />;
    case Step.User:
      return <CreateItemsUser form={form} setForm={setForm} />;
    case Step.ContactMethods:
      return <CreateItemsContactMethods form={form} setForm={setForm} />;
    case Step.PageDesigners:
      return <CreateItemsPageDesigners form={form} setForm={setForm} />;
    default:
      return null;
  }
}
