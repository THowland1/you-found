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

type ServerSideProps = { items: IItem[]; baseUrl: string };

const itemSchema = z.object({
  itemName: z.string(),
  itemHref: z.string()
});

const schema = z.object({
  gap: z.number().min(0),
  codes: z.array(
    z
      .object({
        item: itemSchema,
        width: z.number().min(0),
        padding: z.number().min(0)
      })
      .refine(data => data.padding * 2 < data.width, {
        message: 'Padding cannot take up whole thing',
        path: ['padding']
      })
  )
});

type Schema = z.infer<typeof schema>;
type ItemSchema = z.infer<typeof itemSchema>;

const getItemUrl = (baseUrl: string, item: IItem) =>
  `${baseUrl}/${(item as any).id}`;

const generateInitialValues = (items: IItem[], baseUrl: string): Schema => {
  return {
    gap: 10,
    codes: items.map(item => ({
      item: {
        ...item,
        itemHref: getItemUrl(baseUrl, item)
      },
      width: 50,
      padding: 5
    }))
  };
};

const ItemEditPage: NextPage<ServerSideProps> = ({ items, baseUrl }) => {
  const initialValues = generateInitialValues(items, baseUrl);
  const onSubmit = (values: Schema) => {};
  const theme = useTheme<Theme>();

  if (!items.length) {
    return <p>You do not have any items</p>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(schema)}
      onSubmit={values => onSubmit(values)}
    >
      {({ values }) => (
        <>
          <Head>
            <title>Print QR code</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Shell>
            <Stack position={'absolute'} sx={{ inset: 0 }} direction={'row'}>
              <Box
                flex={1}
                overflow="auto"
                padding="2rem"
                sx={{
                  backgroundColor: theme.palette.grey[300],
                  cursor: 'move'
                }}
              >
                <StickerSheetPreview codes={values.codes} gap={values.gap} />
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  borderLeft: `solid 1px ${theme.palette.grey[200]}`,
                  padding: '1rem',
                  boxShadow: theme.shadows[2],
                  maxWidth: '24rem',
                  overflowX: 'hidden'
                }}
              >
                <Stack gap="1rem">
                  <Typography variant="h4">Print out codes</Typography>
                  <Typography variant="h6">Page</Typography>

                  <FormikTextField
                    name={`gap`}
                    size="small"
                    label="gap"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="off"
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">mm</InputAdornment>
                      )
                    }}
                  />
                  <Stack>
                    <Typography variant="h6">Codes</Typography>
                    <Stack gap="1rem">
                      <FieldArray name="codes">
                        {arrayHelper => (
                          <>
                            {values.codes.map((code, i) => (
                              <React.Fragment key={i}>
                                <Typography variant="body1">
                                  Code {i + 1}
                                  <IconButton
                                    onClick={() => {
                                      arrayHelper.remove(i);
                                    }}
                                  >
                                    <RemoveCircleOutline />
                                  </IconButton>
                                </Typography>

                                <FormikSelectField
                                  name={`codes.${i}.item`}
                                  label="Item"
                                  size="small"
                                  mapValue={{
                                    formikToMui: (formikValue: any) =>
                                      items.findIndex(
                                        (itemm: any) =>
                                          itemm.id === formikValue.id
                                      ),
                                    muiToFormik: (muiValue: number) => ({
                                      ...items[muiValue],
                                      itemHref: getItemUrl(
                                        baseUrl,
                                        items[muiValue]
                                      )
                                    })
                                  }}
                                >
                                  {items.map((itemm, ii) => (
                                    <MenuItem key={ii} value={ii}>
                                      {itemm.itemName}
                                    </MenuItem>
                                  ))}
                                </FormikSelectField>

                                <Stack direction="row" gap="1rem">
                                  <FormikTextField
                                    name={`codes.${i}.width`}
                                    size="small"
                                    label="Size"
                                    InputLabelProps={{ shrink: true }}
                                    autoComplete="off"
                                    type="number"
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          mm
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                  <FormikTextField
                                    name={`codes.${i}.padding`}
                                    size="small"
                                    label="Padding"
                                    InputLabelProps={{ shrink: true }}
                                    autoComplete="off"
                                    type="number"
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          mm
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                </Stack>
                              </React.Fragment>
                            ))}
                            <Button
                              variant="outlined"
                              onClick={_ => {
                                arrayHelper.push({
                                  item: {
                                    ...items[0],
                                    itemHref: getItemUrl(baseUrl, items[0])
                                  },
                                  width: 50,
                                  padding: 5
                                });
                              }}
                            >
                              Add another
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Shell>
        </>
      )}
    </Formik>
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
