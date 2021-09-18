import { Button, Grid, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  IAuthenticationResult,
  IAuthenticationSuccessResult,
  ICredentials,
  useAuthService
} from 'utils/hooks/useAuthService';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';

type Callback<TArg, TResult = void> = (arg: TArg) => TResult;

export const AuthPopupForm: FC<{
  isNewUser: boolean;
  onAuthSuccess: Callback<IAuthenticationSuccessResult>;
}> = ({ isNewUser, onAuthSuccess }) => {
  const { loginWithCredentials, registerWithCredentials } = useAuthService();
  const [error, setError] = React.useState<string | null>(null);

  const schema: yup.SchemaOf<typeof initialValues> = yup.object().shape({
    emailAddress: yup
      .string()
      .required('Please enter a valid email address')
      .email('Please enter a valid email address'),
    password: yup.string().required('Please enter a password')
  });

  const initialValues = { emailAddress: '', password: '' };

  function loginOrRegister(
    credentials: ICredentials
  ): Promise<IAuthenticationResult> {
    return isNewUser
      ? registerWithCredentials(credentials)
      : loginWithCredentials(credentials);
  }

  async function onFormSubmit(values: typeof initialValues) {
    const authResult = await loginOrRegister(values);
    if (authResult.success) {
      onAuthSuccess(authResult);
    } else {
      setError(authResult.error.message);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={ddd => onFormSubmit(ddd)}
      validationSchema={schema}
    >
      {({ errors, handleChange, handleBlur, touched }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="emailAddress"
                type="email"
                fullWidth
                error={Boolean(errors.emailAddress && touched.emailAddress)}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  errors.emailAddress &&
                  touched.emailAddress &&
                  String(errors.emailAddress)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                error={Boolean(errors.password && touched.password)}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  errors.password && touched.password && String(errors.password)
                }
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error" onClose={_ => setError(null)}>
                  {error}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                {isNewUser ? 'Register now' : 'Log in'}
              </Button>
            </Grid>
            {/* <Grid item container xs={12}>
                  <Grid item xs={3} container alignItems="center">
                    <Divider style={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={6} container justify="center" alignItems="center">
                    <Typography>
                      or continue with
                    </Typography>
                  </Grid>
                  <Grid item xs={3} container alignItems="center">
                    <Divider style={{ width: '100%' }} />
                  </Grid>
                </Grid> */}
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
