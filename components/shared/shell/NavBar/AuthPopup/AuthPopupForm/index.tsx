import { Box, Button, Grid, Link, TextField } from '@mui/material';
import {
  IAuthenticationResult,
  useAuthService
} from 'utils/hooks/useAuthService';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import * as yup from 'yup';
import { Alert } from '@mui/material';
import { useAuth } from 'components/shared/auth/useAuth';
import FormikTextField from 'components/fields/FormikTextField';
import { UseState } from 'types/UseState';

type Callback<TArg, TResult = void> = (arg: TArg) => TResult;

export const AuthPopupForm: FC<{
  isNewUserState: UseState<boolean>;
  onAuthSuccess: Callback<IAuthenticationResult & { success: true }>;
}> = ({ isNewUserState, onAuthSuccess }) => {
  const [isNewUser, setIsNewUser] = isNewUserState;

  const {
    loginWithCredentials,
    registerWithCredentials,
    updateUserDisplayName,
    linkUserWithCredentials
  } = useAuthService();
  const { user } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const schema: yup.SchemaOf<typeof initialValues> = yup.object().shape({
    emailAddress: yup
      .string()
      .required('Please enter a valid email address')
      .email('Please enter a valid email address'),
    password: yup.string().required('Please enter a password'),
    displayName: yup.string().when({
      is: () => isNewUser,
      then: yup
        .string()
        .required(
          'Please enter a display name (can be your real name or something wacky)'
        )
    })
  });

  const initialValues = {
    emailAddress: '',
    password: '',
    displayName: '' as string | undefined
  };

  async function linkOrRegister(values: typeof initialValues) {
    if (user) {
      return await linkUserWithCredentials(user, values);
    } else {
      return await registerWithCredentials(values);
    }
  }

  async function onFormSubmit(values: typeof initialValues) {
    if (isNewUser) {
      const registerResult = await linkOrRegister(values);
      if (registerResult.success) {
        const updateResult = await updateUserDisplayName(
          values.displayName as string
        );
        if (updateResult.success) {
          onAuthSuccess(registerResult);
        } else {
          setError(updateResult.error.message);
        }
      } else {
        setError(registerResult.error.message);
      }
    } else {
      const loginResult = await loginWithCredentials(values);
      if (loginResult.success) {
        onAuthSuccess(loginResult);
      } else {
        setError(loginResult.error.message);
      }
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={ddd => onFormSubmit(ddd)}
      validationSchema={schema}
    >
      {({ errors, handleChange, handleBlur, touched, resetForm }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormikTextField
                fullWidth
                label="Email"
                name="emailAddress"
                type="email"
              />
            </Grid>
            {isNewUser && (
              <Grid item xs={12}>
                <FormikTextField
                  fullWidth
                  label="Display name"
                  name="displayName"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormikTextField
                fullWidth
                label="Password"
                name="password"
                type="password"
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
                {isNewUser ? 'Create account' : 'Log in'}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ fontSize: 'small', textAlign: 'center' }}>
                {isNewUser ? 'Already have an account?' : 'New here?'}&nbsp;
                <Link
                  component="button"
                  type="button"
                  onClick={() => {
                    setIsNewUser(!isNewUser);
                    resetForm();
                  }}
                  underline="hover"
                >
                  {isNewUser ? 'Log in' : 'Create an account'}
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
