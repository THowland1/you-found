import {
  Close,
  Email,
  Phone as PhoneIcon,
  Sms,
  Visibility,
  WhatsApp
} from '@mui/icons-material';
import {
  Box,
  Fade,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  SpeedDial,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography
} from '@mui/material';
import axios from 'axios';
import FormikSelectField from 'components/fields/FormikSelectField';
import FormikSwitchField from 'components/fields/FormikSwitchField';
import FormikTextField from 'components/fields/FormikTextField';
import LandingPage from 'components/items/LandingPage';
import Shell from 'components/shared/shell';
import { getItemByItemSlug } from 'data-layer/getItemByItemSlug';
import { FieldArray, Form, Formik } from 'formik';
import formikPathBuilder from 'formik-path-builder';
import { INewItem } from 'models/new-item';
import { IItem, IItemSchema } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import React, { useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

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
                <Box flex={1}>
                  <Stack maxWidth="40rem" padding={2} margin="auto">
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
                    <Stack gap={1}>
                      <FieldArray name={p('links')()}>
                        {arrayHelpers =>
                          values.links.map((link, i) => {
                            return (
                              <Paper key={i} sx={{ padding: 1 }}>
                                <Stack gap={1}>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <Box flex={1} maxWidth="11rem">
                                      <FormikSelectField<
                                        'whatsapp' | 'email' | 'call' | 'sms'
                                      >
                                        size="small"
                                        name={`links.${i}.linkType`}
                                        renderValue={(
                                          value:
                                            | 'whatsapp'
                                            | 'email'
                                            | 'call'
                                            | 'sms'
                                        ) => <>{LINKTYPES[value].label}</>}
                                        startAdornment={
                                          <InputAdornment position="start">
                                            {
                                              LINKTYPES[
                                                values.links[i].linkType
                                              ].icon
                                            }
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
                                    </Box>
                                    <Box flex={1} maxWidth="11rem">
                                      {['whatsapp', 'call', 'sms'].includes(
                                        values.links[i].linkType
                                      ) && (
                                        <FormikTextField
                                          size="small"
                                          name={`links.${i}.phoneNumber`}
                                        />
                                      )}
                                      {['email'].includes(
                                        values.links[i].linkType
                                      ) && (
                                        <FormikTextField
                                          size="small"
                                          name={`links.${i}.emailAddress`}
                                        />
                                      )}
                                    </Box>
                                    <Box display="flex" justifyContent="end">
                                      <FormikSwitchField
                                        name={p('links')(i)('showButton')()}
                                        label=""
                                      />
                                    </Box>
                                  </Stack>
                                  <Stack>
                                    <FormikTextField
                                      size="small"
                                      name={p('links')(i)('buttonText')()}
                                    />
                                  </Stack>
                                </Stack>
                              </Paper>
                            );
                          })
                        }
                      </FieldArray>
                      <Box
                        height="4rem"
                        display={{ xs: 'block', md: 'none' }}
                      ></Box>
                    </Stack>
                  </Stack>
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
                </Box>

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

const Phone = ({ item, sx = {} }: { item: IItem; sx?: SxProps<Theme> }) => {
  return (
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
};

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
