import {
  AlternateEmail,
  Close,
  Dialpad,
  Email,
  Phone as PhoneIcon,
  Save,
  Sms,
  TextFields,
  Visibility,
  WhatsApp
} from '@mui/icons-material';
import {
  Alert,
  Box,
  CircularProgress,
  Fab,
  Fade,
  Grow,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Slide,
  Snackbar,
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
  const [initialValues, setInitialValues] = useState(item);
  const [showSuccess, setShowSuccess] = useState(false);

  const saveChanges = async (values: IItem) => {
    const newValues = await axios.put(`/api/items/${item.itemSlug}`, values);
    setInitialValues(newValues.data);
    setShowSuccess(true);
    setTimeout(_ => setShowSuccess(false), 5000);
  };
  const [showPreview, setShowPreview] = useState(false);
  const containerRef = React.useRef<HTMLElement | null>(null);

  return (
    <>
      <Head>
        <title>Update code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={toFormikValidationSchema(IItemSchema)}
        onSubmit={saveChanges}
      >
        {({ values, submitForm, isSubmitting, dirty }) => (
          <Form>
            <Shell>
              <Stack direction="row" sx={{ inset: 0 }} position={'absolute'}>
                <Box flex={1} sx={{ overflowY: 'auto', top: 0, bottom: 0 }}>
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
                              <Paper
                                key={i}
                                sx={{
                                  padding: 1,
                                  opacity: link.showButton ? 1 : 0.5
                                }}
                              >
                                <Stack gap={1}>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <Stack flex={1} gap={1}>
                                      <Box width="11rem">
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
                                            <ListItemText>
                                              WhatsApp
                                            </ListItemText>
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
                                      <Box flex={1} maxWidth="20rem">
                                        {['whatsapp', 'call', 'sms'].includes(
                                          values.links[i].linkType
                                        ) && (
                                          <FormikTextField
                                            fullWidth
                                            size="small"
                                            name={`links.${i}.phoneNumber`}
                                            // variant="standard"
                                            InputProps={{
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                  <Dialpad />
                                                </InputAdornment>
                                              )
                                            }}
                                          />
                                        )}
                                        {['email'].includes(
                                          values.links[i].linkType
                                        ) && (
                                          <FormikTextField
                                            fullWidth
                                            size="small"
                                            name={`links.${i}.emailAddress`}
                                            // variant="standard"
                                            InputProps={{
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                  <AlternateEmail />
                                                </InputAdornment>
                                              )
                                            }}
                                          />
                                        )}
                                      </Box>
                                    </Stack>

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
                                      // variant="standard"
                                      name={p('links')(i)('buttonText')()}
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <TextFields />
                                          </InputAdornment>
                                        )
                                      }}
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
                      position: 'sticky',
                      bottom: '2rem',
                      width: '100%',
                      display: 'flex',
                      gap: '2rem',
                      justifyContent: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        display: { xs: 'block', md: 'none' }
                      }}
                    >
                      <Fab
                        variant="extended"
                        color="primary"
                        onClick={_ => setShowPreview(!showPreview)}
                      >
                        <Visibility sx={{ mr: 1 }} />
                        Preview
                      </Fab>
                    </Box>
                    <Box position="relative">
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: '100%',
                          marginBottom: '.5rem',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Grow in={showSuccess}>
                          <Box ref={containerRef}>
                            <Slide
                              direction="up"
                              container={containerRef.current}
                              in={showSuccess}
                            >
                              <Alert
                                variant="filled"
                                sx={{ paddingY: 0, paddingX: '1rem' }}
                              >
                                Saved!
                              </Alert>
                            </Slide>
                          </Box>
                        </Grow>
                      </Box>

                      <Fab
                        color="primary"
                        variant="extended"
                        onClick={async _ => await submitForm()}
                        disabled={!dirty || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <CircularProgress
                              color="inherit"
                              size="1.5rem"
                              sx={{ mr: 1 }}
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save sx={{ mr: 1 }} />
                            Save changes
                          </>
                        )}
                      </Fab>
                    </Box>
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
