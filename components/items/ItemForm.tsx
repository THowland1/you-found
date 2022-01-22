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
import FormikTextField from 'components/fields/FormikTextField';
import Shell from 'components/shared/shell';
import { Field, Form, Formik, useField } from 'formik';
import { INewItem, newItemSchema } from 'models/new-item';
import { IItem } from 'models/schema/item';
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

type ItemFormProps = {
  initialValues: IItem;
  onSubmit: (val: IItem) => any;
};
function ItemForm({ initialValues, onSubmit }: ItemFormProps): JSX.Element {
  const theme = useTheme();
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(newItemSchema)}
        onSubmit={values => onSubmit(values)}
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
}

export default ItemForm;

type CheckboxWithLabelProps = CheckboxProps & FormControlLabelProps;
function CheckboxWithLabel(props: CheckboxWithLabelProps): JSX.Element {
  return (
    <FormControlLabel label={props.label} control={<Checkbox {...props} />} />
  );
}
