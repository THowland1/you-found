import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
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
import axios from 'axios';
import { Field, Form, Formik, useField } from 'formik';
import { NextPage } from 'next';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

export const schema = z.object({
  itemName: z.string(),
  headline: z.string(),
  message: z.string(),
  phoneNumber: z.string(),
  showWhatsAppLink: z.boolean(),
  showPhoneCallLink: z.boolean(),
  showSMSLink: z.boolean(),
  emailAddress: z.string().email(),
  showEmailLink: z.boolean()
});

export type Schema = z.infer<typeof schema>;

// const initialValues: Schema = {
//   itemName: '',
//   headline: '',
//   message: '',
//   phoneNumber: '',
//   showWhatsAppLink: false,
//   showPhoneCallLink: false,
//   showSMSLink: false,

//   emailAddress: '',
//   showEmailLink: false
// };

const initialValues: Schema = {
  itemName: 'Headphones',
  headline: "Hi, I'm Ben and you have found my headphones",
  message: 'Please get in touch to return them to me',
  phoneNumber: '+7722681180',
  showWhatsAppLink: false,
  showPhoneCallLink: false,
  showSMSLink: false,

  emailAddress: 'tomhowland9@gmail.com',
  showEmailLink: false
};

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
  const submitUser = async (values: Schema) => {
    await axios.post('/api/items', values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(schema)}
      onSubmit={values => submitUser(values)}
    >
      {({ values, submitForm, isSubmitting }) => (
        <Form>
          <Grid
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#fff',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3Crect stroke='%23ffffff' stroke-width='.5' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cuse fill='%23fcfcfc' href='%23s' y='2'/%3E%3Cuse fill='%23fcfcfc' href='%23s' x='1' y='2'/%3E%3Cuse fill='%23fafafa' href='%23s' x='2' y='2'/%3E%3Cuse fill='%23fafafa' href='%23s'/%3E%3Cuse fill='%23f7f7f7' href='%23s' x='2'/%3E%3Cuse fill='%23f7f7f7' href='%23s' x='1' y='1'/%3E%3C/pattern%3E%3Cpattern id='b' width='7' height='11' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f5f5f5'%3E%3Cuse href='%23s'/%3E%3Cuse href='%23s' y='5' /%3E%3Cuse href='%23s' x='1' y='10'/%3E%3Cuse href='%23s' x='2' y='1'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='8'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='5' y='2'/%3E%3Cuse href='%23s' x='5' y='6'/%3E%3Cuse href='%23s' x='6' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='h' width='5' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f5f5f5'%3E%3Cuse href='%23s' y='5'/%3E%3Cuse href='%23s' y='8'/%3E%3Cuse href='%23s' x='1' y='1'/%3E%3Cuse href='%23s' x='1' y='9'/%3E%3Cuse href='%23s' x='1' y='12'/%3E%3Cuse href='%23s' x='2'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='2'/%3E%3Cuse href='%23s' x='3' y='6'/%3E%3Cuse href='%23s' x='3' y='11'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='4' y='10'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='17' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23f2f2f2'%3E%3Cuse href='%23s' y='11'/%3E%3Cuse href='%23s' x='2' y='9'/%3E%3Cuse href='%23s' x='5' y='12'/%3E%3Cuse href='%23s' x='9' y='4'/%3E%3Cuse href='%23s' x='12' y='1'/%3E%3Cuse href='%23s' x='16' y='6'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='19' height='17' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23ffffff'%3E%3Cuse href='%23s' y='9'/%3E%3Cuse href='%23s' x='16' y='5'/%3E%3Cuse href='%23s' x='14' y='2'/%3E%3Cuse href='%23s' x='11' y='11'/%3E%3Cuse href='%23s' x='6' y='14'/%3E%3C/g%3E%3Cg fill='%23efefef'%3E%3Cuse href='%23s' x='3' y='13'/%3E%3Cuse href='%23s' x='9' y='7'/%3E%3Cuse href='%23s' x='13' y='10'/%3E%3Cuse href='%23s' x='15' y='4'/%3E%3Cuse href='%23s' x='18' y='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='53' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='2' y='5'/%3E%3Cuse href='%23s' x='16' y='38'/%3E%3Cuse href='%23s' x='46' y='42'/%3E%3Cuse href='%23s' x='29' y='20'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='59' height='71' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='33' y='13'/%3E%3Cuse href='%23s' x='27' y='54'/%3E%3Cuse href='%23s' x='55' y='55'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='g' width='139' height='97' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23F60'%3E%3Cuse href='%23s' x='11' y='8'/%3E%3Cuse href='%23s' x='51' y='13'/%3E%3Cuse href='%23s' x='17' y='73'/%3E%3Cuse href='%23s' x='99' y='57'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23b)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23h)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23c)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23d)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23e)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23f)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23g)' width='100%25' height='100%25'/%3E%3C/svg%3E")`,
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover'
            }}
          >
            <Grid container maxWidth={'600px'} margin={'auto'}>
              <Grid container gap="1rem" padding="1rem" direction="column">
                <Typography variant="h1">Register a QR code</Typography>
                <Paper>
                  <Grid container gap="1rem" padding="1rem" direction="column">
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
                  <Grid container gap="1rem" padding="1rem" direction="column">
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
                  <Grid container gap="1rem" padding="1rem" direction="column">
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
                  <Grid container gap="1rem" padding="1rem" direction="column">
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
                  <Grid container gap="1rem" padding="1rem" direction="column">
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
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default NewPage;

type CheckboxWithLabelProps = CheckboxProps & FormControlLabelProps;
function CheckboxWithLabel(props: CheckboxWithLabelProps): JSX.Element {
  return (
    <FormControlLabel label={props.label} control={<Checkbox {...props} />} />
  );
}
