import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
  Grid,
  Paper,
  TextField,
  TextFieldProps,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/system';
import axios from 'axios';
import Shell from 'components/shared/shell';
import { Field, Form, Formik, useField } from 'formik';
import { INewItem, newItemSchema } from 'models/new-item';
import { NextPage } from 'next';
import Head from 'next/head';
import { toFormikValidationSchema } from 'zod-formik-adapter';

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

// const initialValues: Schema = {
//   itemName: 'Headphones',
//   headline: "Hi, I'm Ben and you have found my headphones",
//   message: 'Please get in touch to return them to me',
//   phoneNumber: '+7722681180',
//   showWhatsAppLink: false,
//   showPhoneCallLink: false,
//   showSMSLink: false,

//   emailAddress: 'tomhowland9@gmail.com',
//   showEmailLink: false
// };

type FormikFieldProps = { name: string };
function FormikTextField({
  name,
  ...props
}: TextFieldProps & FormikFieldProps) {
  const [inputProps, metaProps, helperProps] = useField(name);

  return (
    <>
      <TextField
        value={inputProps.value}
        onBlur={_ => helperProps.setTouched(true)}
        onChange={e => helperProps.setValue(e.target.value)}
        error={metaProps.touched && Boolean(metaProps.error)}
        helperText={metaProps.touched && metaProps.error}
        {...props}
      />
    </>
  );
}

const NewPage: NextPage = () => {
  const submitUser = async (values: INewItem) => {
    await axios.post('/api/items', values);
  };

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Register new code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(newItemSchema)}
        onSubmit={values => submitUser(values)}
      >
        {({ values, submitForm, isSubmitting }) => (
          <Form>
            <Shell>
              <Grid container maxWidth={'600px'} margin={'auto'}>
                <Grid container gap="1rem" padding="1rem" direction="column">
                  <Typography variant="h2">Register a QR code</Typography>
                  <Paper>
                    <Grid
                      container
                      gap="1rem"
                      padding="1rem"
                      direction="column"
                    >
                      <Box component="div">
                        <FormikTextField
                          name="itemName"
                          label="Item name"
                          placeholder="e.g. Headphones"
                          InputLabelProps={{ shrink: true }}
                          autoComplete="off"
                          fullWidth
                        />
                      </Box>
                    </Grid>
                  </Paper>
                  <Paper>
                    <Grid
                      container
                      gap="1rem"
                      padding="1rem"
                      direction="column"
                    >
                      <Box component="div">
                        <FormikTextField
                          name="headline"
                          label="Headline"
                          placeholder="e.g. Hi, I'm Ben, and you have found my headphones"
                          multiline
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Box>
                      <Box component="div">
                        <FormikTextField
                          name="message"
                          label="Message"
                          placeholder="e.g. I would appreciate it if you could contact me with one of the methods below"
                          multiline
                          minRows={2}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Box>
                    </Grid>
                  </Paper>
                  <Paper>
                    <Grid
                      container
                      gap="1rem"
                      padding="1rem"
                      direction="column"
                    >
                      <Box component="div">
                        <FormikTextField
                          name="phoneNumber"
                          label="Phone number"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Box>
                      <Box component="div">
                        <Field
                          name="showWhatsAppLink"
                          as={CheckboxWithLabel}
                          {...({
                            label: 'Show WhatsApp link'
                          } as CheckboxWithLabelProps)}
                        />
                      </Box>

                      <Box component="div">
                        <Field
                          name="showPhoneCallLink"
                          as={CheckboxWithLabel}
                          {...({
                            label: 'Show phone call link'
                          } as CheckboxWithLabelProps)}
                        />
                      </Box>

                      <Box component="div">
                        <Field
                          name="showSMSLink"
                          as={CheckboxWithLabel}
                          {...({
                            label: 'Show SMS link'
                          } as CheckboxWithLabelProps)}
                        />
                      </Box>
                    </Grid>
                  </Paper>
                  <Paper>
                    <Grid
                      container
                      gap="1rem"
                      padding="1rem"
                      direction="column"
                    >
                      <Box component="div">
                        <FormikTextField
                          name="emailAddress"
                          label="Email address"
                          type={'email'}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Box>

                      <Box component="div">
                        <Field
                          name="showEmailLink"
                          as={CheckboxWithLabel}
                          {...({
                            label: 'Show email link'
                          } as CheckboxWithLabelProps)}
                        />
                      </Box>
                    </Grid>
                  </Paper>
                  <Paper>
                    <Grid
                      container
                      gap="1rem"
                      padding="1rem"
                      direction="column"
                    >
                      <LoadingButton
                        loading={isSubmitting}
                        variant="contained"
                        onClick={() => {
                          submitForm();
                        }}
                      >
                        Submit
                      </LoadingButton>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Shell>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default NewPage;

type CheckboxWithLabelProps = CheckboxProps & FormControlLabelProps;
function CheckboxWithLabel(props: CheckboxWithLabelProps): JSX.Element {
  return (
    <FormControlLabel label={props.label} control={<Checkbox {...props} />} />
  );
}
