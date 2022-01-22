import {
  Grid,
  Paper,
  Typography,
  Stack,
  Box,
  useTheme,
  Theme,
  Button,
  IconButton
} from '@mui/material';
import Print from '@mui/icons-material/Print';
import { Dump } from 'components/shared/Dump';
import Shell from 'components/shared/shell';
import { getItemById } from 'data-layer/getItemById';
import { Formik, FieldArray } from 'formik';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import QRCode from 'qrcode.react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import ScrollContainer from 'react-indiana-drag-scroll';
import FormikTextField from 'components/fields/FormikTextField';
import { RemoveCircleOutline } from '@mui/icons-material';

type ServerSideProps = { item: IItem; baseUrl: string };

const schema = z.object({
  codes: z.array(
    z.object({
      value: z.string(),
      width: z.number().min(0)
    })
  )
});

type Schema = z.infer<typeof schema>;

const generateInitialValues = (value: string): Schema => {
  return {
    codes: [
      {
        value,
        width: 20
      }
    ]
  };
};

const ItemEditPage: NextPage<ServerSideProps> = ({ item, baseUrl }) => {
  const itemHref = `https://${baseUrl}/${(item as any).id}`;
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
                component={ScrollContainer}
                flex={1}
                overflow="auto"
                padding="2rem"
                sx={{
                  backgroundColor: theme.palette.grey[300],
                  cursor: 'move'
                }}
              >
                <Paper sx={{ width: '210mm', height: '297mm', margin: 'auto' }}>
                  <Grid
                    container
                    gap="1rem"
                    padding="1rem"
                    direction="row"
                    flexWrap={'wrap'}
                  >
                    {values.codes.map(({ value, width }, i) => (
                      <QRCode
                        key={i}
                        value={value}
                        renderAs="svg"
                        width={`${width}mm`}
                        height={`${width}mm`}
                      />
                    ))}
                  </Grid>
                </Paper>
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
                  <FieldArray name="codes">
                    {arrayHelper => (
                      <>
                        {values.codes.map((code, i) => (
                          <>
                            <Typography variant="h6">
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
                              fullWidth
                              type="number"
                            />
                          </>
                        ))}
                        <Button
                          variant="outlined"
                          onClick={_ => {
                            arrayHelper.push({ value: itemHref, width: 20 });
                          }}
                        >
                          Add another
                        </Button>
                        <Button startIcon={<Print />} variant="contained">
                          Print codes
                        </Button>
                      </>
                    )}
                  </FieldArray>
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
  const baseUrl = z.string().url().parse(req.headers.host);
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
