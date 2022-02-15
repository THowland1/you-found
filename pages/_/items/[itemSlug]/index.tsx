import {
  Close,
  Email,
  Phone as PhoneIcon,
  Sms,
  WhatsApp,
  Visibility
} from '@mui/icons-material';

import {
  Box,
  Button,
  Fade,
  IconButton,
  SpeedDial,
  Modal,
  Dialog,
  DialogContent,
  Stack,
  Theme,
  SxProps,
  Tooltip,
  Paper,
  Typography,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ListItem,
  InputAdornment
} from '@mui/material';
import axios from 'axios';
import ItemForm from 'components/items/ItemForm';
import LandingPage from 'components/items/LandingPage';
import Shell from 'components/shared/shell';
import { getItemById } from 'data-layer/getItemById';
import { getItemByItemSlug } from 'data-layer/getItemByItemSlug';
import { Formik, Form, FieldArray } from 'formik';
import { INewItem } from 'models/new-item';
import { IItem, IItemSchema } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import formikPathBuilder from 'formik-path-builder';
import FormikTextField from 'components/fields/FormikTextField';
import FormikSelectField from 'components/fields/FormikSelectField';

const LINKTYPES: Record<
  'whatsapp' | 'call' | 'sms' | 'email',
  { type: string; icon: React.ReactNode; label: string }
> = {
  whatsapp: { type: 'whatsapp', icon: <WhatsApp />, label: 'WhatsApp' },
  call: { type: 'call', icon: <PhoneIcon />, label: 'Call' },
  sms: { type: 'sms', icon: <Sms />, label: 'SMS' },
  email: { type: 'email', icon: <Email />, label: 'Email' }
};

type ServerSideProps = { item: IItem };
const p = formikPathBuilder<IItem>();

const ItemEditPage: NextPage<ServerSideProps> = ({ item }) => {
  const router = useRouter();
  const postNewItem = async (values: INewItem) => {
    await axios.put(`/api/items/${item.itemSlug}`, values);
    await router.push(`/_/items`);
  };
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <Head>
        <title>Update code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Formik
        initialValues={item}
        validationSchema={toFormikValidationSchema(IItemSchema)}
        onSubmit={_ => {}}
      >
        {({ values, submitForm, isSubmitting }) => (
          <Form>
            <Shell>
              <Stack direction="row" sx={{ inset: 0 }} position={'absolute'}>
                <Stack flex={1} padding={2}>
                  <Typography padding={1} paddingBottom={0.5} variant="h4">
                    Headline
                  </Typography>
                  <Paper sx={{ padding: 1 }}>
                    <FormikTextField fullWidth name={p('headline')()} />
                  </Paper>
                  <Typography padding={1} paddingBottom={0.5} variant="h4">
                    Message
                  </Typography>
                  <Paper sx={{ padding: 1 }}>
                    <FormikTextField
                      fullWidth
                      multiline
                      name={p('message')()}
                    />
                  </Paper>
                  <Typography padding={1} paddingBottom={0.5} variant="h4">
                    Links
                  </Typography>
                  <FieldArray name={p('links')()}>
                    {arrayHelpers =>
                      values.links.map((link, i) => (
                        <Paper key={i} sx={{ padding: 1 }}>
                          <FormikSelectField
                            size="small"
                            name={`links.${i}.linkType`}
                            renderValue={(value: string) =>
                              LINKTYPES[value].label
                            }
                            startAdornment={
                              <InputAdornment position="start">
                                {LINKTYPES[values.links[i].linkType].icon}
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="email">
                              <ListItemIcon>
                                <Email />
                              </ListItemIcon>
                              <ListItemText>Email</ListItemText>
                            </MenuItem>
                            <MenuItem value="whatsapp">
                              <ListItemIcon>
                                <WhatsApp />
                              </ListItemIcon>
                              <ListItemText>WhatsApp</ListItemText>
                            </MenuItem>
                            <MenuItem value="call">
                              <ListItemIcon>
                                <PhoneIcon />
                              </ListItemIcon>
                              <ListItemText>Phone</ListItemText>
                            </MenuItem>
                            <MenuItem value="sms">
                              <ListItemIcon>
                                <Sms />
                              </ListItemIcon>
                              <ListItemText>SMS</ListItemText>
                            </MenuItem>
                          </FormikSelectField>
                        </Paper>
                      ))
                    }
                  </FieldArray>
                  <Box
                    sx={{
                      position: 'fixed',
                      bottom: '2rem',
                      display: { xs: 'block', md: 'none' },
                      width: '100%'
                    }}
                  >
                    <SpeedDial
                      ariaLabel="see preview"
                      onClick={_ => setShowPreview(!showPreview)}
                      icon={showPreview ? <Close /> : <Visibility />}
                    ></SpeedDial>
                  </Box>
                </Stack>

                <Stack
                  display={{ xs: 'none', md: 'flex' }}
                  width={{ xs: 0, sm: '400px', md: '30rem' }}
                  bgcolor={'#e6e6e6'}
                >
                  <Phone item={values} />
                </Stack>
              </Stack>
            </Shell>
            <Modal onClose={_ => setShowPreview(false)} open={showPreview}>
              <Fade in={showPreview}>
                <Stack
                  justifyContent="space-evenly"
                  sx={{ position: 'absolute', inset: 0, margin: 'auto' }}
                >
                  <Phone item={values} sx={{ marginY: 0 }} />
                  <Box
                    sx={{
                      position: 'fixed',
                      bottom: '2rem',
                      display: 'block',
                      width: '100%'
                    }}
                  >
                    <SpeedDial
                      ariaLabel="see preview"
                      onClick={_ => setShowPreview(!showPreview)}
                      icon={
                        <Tooltip title="Close" placement="top">
                          <Close />
                        </Tooltip>
                      }
                    ></SpeedDial>
                  </Box>
                </Stack>
              </Fade>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ItemEditPage;

const Phone = ({ item, sx = {} }: { item: IItem; sx?: SxProps<Theme> }) => (
  <Box
    sx={{
      bgcolor: 'white',
      borderRadius: '3rem',
      height: '600px',
      width: '352px',
      border: 'solid 16px black',
      margin: 'auto',
      position: 'relative',
      overflow: 'auto',
      '::-webkit-scrollbar': {
        display: 'none'
      },
      ...sx
    }}
  >
    <LandingPage item={item} />
  </Box>
);

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
