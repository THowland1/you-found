import { RemoveCircleOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Theme,
  Typography,
  useTheme
} from '@mui/material';
import FormikTextField from 'components/fields/FormikTextField';
import Shell from 'components/shared/shell';
import { getItemById } from 'data-layer/getItemById';
import { FieldArray, Formik } from 'formik';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import StickerSheetPreview from 'components/StickerSheetPreview';

type ServerSideProps = { item: IItem; baseUrl: string };

const schema = z.object({
  gap: z.number().min(0),
  codes: z.array(
    z
      .object({
        value: z.string(),
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

const generateInitialValues = (value: string): Schema => {
  return {
    gap: 10,
    codes: [
      {
        value,
        width: 50,
        padding: 5
      }
    ]
  };
};

const ItemEditPage: NextPage<ServerSideProps> = ({ item, baseUrl }) => {
  const itemHref = `${baseUrl}/${item.itemSlug}`;
  const initialValues = generateInitialValues(itemHref);
  const onSubmit = (values: Schema) => {};
  const theme = useTheme<Theme>();

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
                {/* <StickerSheetPreview codes={values.codes} gap={values.gap} /> */}
              </Box>

              <Box
                sx={{
                  backgroundColor: 'white',
                  borderLeft: `solid 1px ${theme.palette.grey[200]}`,
                  padding: '1rem',
                  boxShadow: theme.shadows[2],
                  maxWidth: '24rem',
                  overflow: 'hidden'
                }}
              >
                <Stack gap="1rem">
                  <Typography variant="h4">Print out codes</Typography>
                  <Typography variant="h6">Page</Typography>

                  <FormikTextField
                    name={`gap`}
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

                                <FormikTextField
                                  name={`codes.${i}.width`}
                                  label="width"
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
                                  label="padding"
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
                              </React.Fragment>
                            ))}
                            <Button
                              variant="outlined"
                              onClick={_ => {
                                arrayHelper.push({
                                  value: itemHref,
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

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query,
  req
}) => {
  const itemId = z.string().parse(query.itemId);
  const baseUrl = z.string().url().parse(process.env.ORIGIN);
  const item = await getItemById(itemId);

  if (item) {
    return { props: { item, baseUrl } };
  } else {
    return {
      redirect: { destination: '404', statusCode: 404, permanent: false },
      props: {}
    };
  }
};

function encodeSvg(reactElement: JSX.Element) {
  return 'data:image/svg+xml,' + ReactDOMServer.renderToString(reactElement);
}
