import { Button, Typography } from '@material-ui/core';
import { QrCodeNoSSR } from 'components/qr-code/qr-code-no-ssr';
import { QrCodeRef } from 'components/qr-code/qr-code-ref';
import React, { createRef, useRef, useState } from 'react';
import { SubformParams } from '../subform-params';
import styles from './confirm.module.scss';
import QRCodeStyling from 'qr-code-styling';
import { DEFAULT_QR_CODE_OPTIONS } from 'components/qr-code/default-qr-code-options';
import axios, { AxiosError } from 'axios';
import { realisticConfetti } from 'utils/confetti/realistic-confetti';
import { mapFormToRequestBody } from './map-form-to-request-body';
import { Step } from '../step';
import { INewItemsResponse } from 'models/api/new-items-response';
import { mapResponseBodyToSubform } from './map-response-body-to-subform';

type Params = SubformParams;

export default function CreateItemsConfirm({ form, setForm }: Params) {
  const submitUser = async () => {
    const body = mapFormToRequestBody(form);
    try {
      const response = await axios.post<INewItemsResponse>(
        '/api/create-items',
        body
      );
      await onSuccess(response.data);
    } catch (e) {
      const error: AxiosError<any> = e;
      if (error.isAxiosError) {
        setError(error.response?.data.message);
      }
    }
  };
  async function onSuccess(response: INewItemsResponse) {
    setForm({
      ...form,
      step: Step.Success,
      [Step.Confirm]: mapResponseBodyToSubform(response),
    });
    realisticConfetti();
  }
  const [error, setError] = useState<any>(null);

  const [items, setItems] = useState(form['01-names'].items);
  const onlyOneItem = items.length === 1;

  return (
    <>
      <div className={styles['create-user-page']}>
        <header className={styles.header}>
          <Typography
            className={styles.muted}
            variant='h6'
            align='center'
            component='h1'
          >
            Create QR codes
          </Typography>
          <Typography variant='h4' component='h2' align='center'>
            Confirm
          </Typography>
        </header>
        <div className={styles.content}>Are you ready?</div>
        <div
          className={styles.content}
          style={{ width: '20rem', padding: '1rem', marginTop: '1rem' }}
        >
          <Button
            variant='contained'
            color='primary'
            onClick={(_) => submitUser()}
          >
            Yeah, make my QR codes
          </Button>
        </div>
      </div>
    </>
  );
}
