import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack
} from '@mui/material';
import FormikTextField from 'components/fields/FormikTextField';
import { FieldArray, Form, Formik } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import { useAuthService } from 'utils/hooks/useAuthService';
import firebase from 'firebase/app';
import p from 'formik-path-builder';
import { SignalCellularNullTwoTone } from '@mui/icons-material';

type PhoneNumberFieldProps = {
  user: firebase.User;
  onFinish: () => void;
};
export function PhoneNumberField({ user, onFinish }: PhoneNumberFieldProps) {
  const authService = useAuthService();
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<firebase.auth.ConfirmationResult | null>(null);

  return (
    <>
      <Stack>
        <Formik
          initialValues={{ phoneNumber: '' }}
          onSubmit={async values => {
            setLoading(true);
            const result = await authService.linkWithPhoneNumber(
              user,
              values.phoneNumber
            );
            if (result.success) {
              setConfirmationResult(result.confirmationResult);
            } else {
              alert('Could not do it');
            }
            setLoading(false);
          }}
        >
          {({ submitForm }) => (
            <Form>
              <FormikTextField size="small" name="phoneNumber" />
              {!confirmationResult && (
                <Stack direction="row" justifyContent="space-between">
                  <Button onClick={_ => onFinish()}>Cancel</Button>
                  <LoadingButton
                    loading={loading}
                    id="new-phone-number-submit"
                    onClick={_ => submitForm()}
                  >
                    Submit
                  </LoadingButton>
                </Stack>
              )}
            </Form>
          )}
        </Formik>
        {confirmationResult && (
          <Formik
            initialValues={{ verificationCode: ['', '', '', '', '', ''] }}
            onSubmit={async values => {
              setVerifyLoading(false);

              const verificationCode = values.verificationCode.join('');
              await confirmationResult.confirm(verificationCode);

              setVerifyLoading(true);
              onFinish();
            }}
          >
            {({ values, submitForm }) => (
              <Form>
                <Stack direction="row" justifyContent="space-between">
                  <FieldArray name={p(values)('verificationCode')()}>
                    {arrayHelpers => (
                      <>
                        {values.verificationCode.map((char, i) => (
                          <FormikTextField
                            key={i}
                            inputProps={{
                              'data-vc-tabindex': String(i),
                              onFocus: e => e.target.select(),
                              maxLength: 1,
                              sx: {
                                padding: 0,
                                textAlign: 'center',
                                height: '40px',
                                maxWidth: '2rem'
                              }
                            }}
                            size="small"
                            name={p(values)('verificationCode')(i)()}
                            onKeyUp={e => {
                              function queryByVcTabIndex(vcTabIndex: number) {
                                return document.querySelector(
                                  `[data-vc-tabindex*='${vcTabIndex}']`
                                );
                              }
                              switch (e.key) {
                                case 'Enter':
                                  break;
                                case 'Backspace':
                                case 'Delete':
                                case 'ArrowLeft':
                                  const prevElement = queryByVcTabIndex(i - 1);
                                  if (
                                    prevElement instanceof HTMLInputElement ||
                                    prevElement instanceof HTMLButtonElement
                                  ) {
                                    prevElement.focus();
                                  }
                                  break;

                                default:
                                  const nextElement = queryByVcTabIndex(i + 1);
                                  if (
                                    nextElement instanceof HTMLInputElement ||
                                    nextElement instanceof HTMLButtonElement
                                  ) {
                                    nextElement.focus();
                                  }
                                  break;
                              }
                            }}
                          />
                        ))}
                      </>
                    )}
                  </FieldArray>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Button onClick={_ => onFinish()}>Cancel</Button>
                  <LoadingButton
                    loading={verifyLoading}
                    id="new-phone-number-submit"
                    onClick={_ => submitForm()}
                  >
                    Verify
                  </LoadingButton>
                </Stack>
              </Form>
            )}
          </Formik>
        )}
      </Stack>
    </>
  );
}

const Redirect: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: { destination: '404', statusCode: 404, permanent: false },
    props: {}
  };
};

export default Redirect;
