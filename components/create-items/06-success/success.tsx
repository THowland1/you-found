import { Button, Typography } from '@material-ui/core';
import { QrCodeNoSSR } from 'components/qr-code/qr-code-no-ssr';
import { QrCodeRef } from 'components/qr-code/qr-code-ref';
import React, { createRef, useRef, useState } from 'react';
import { SubformParams } from '../subform-params';
import styles from './success.module.scss';
import QRCodeStyling from 'qr-code-styling';
import { DEFAULT_QR_CODE_OPTIONS } from 'components/qr-code/default-qr-code-options';
import { SuccessQrCodeNoSSR } from './success-qr-code-no-ssr';
import { Step } from '../step';

function getUrlFromId(itemId: string) {
  return `https://youfound.app/${itemId}`;
}

type Params = SubformParams;

export default function CreateItemsSuccess({ form, setForm }: Params) {
  const [error, setError] = useState<any>(null);

  const [items, setItems] = useState(form[Step.Confirm].items);
  const onlyOneItem = items.length === 1;

  function backToStart() {
    setForm({ ...form, step: Step.Names });
  }

  return (
    <>
      <div className={styles['create-user-page']}>
        <Button
          variant="contained"
          color="primary"
          onClick={_ => backToStart()}
        >
          Back To STart
        </Button>
        <header className={styles.header}>
          <Typography
            className={styles.muted}
            variant="h6"
            align="center"
            component="h1"
          >
            Create QR codes
          </Typography>
          <Typography variant="h4" component="h2" align="center">
            Here {onlyOneItem ? 'is' : 'are'} your QR code
            {onlyOneItem ? '' : 's'}!
          </Typography>
        </header>
        <div className={styles.contents}>
          {items.map(item => (
            <div key={item.itemId} className={styles.content}>
              <SuccessQrCodeNoSSR
                itemId={item.itemId}
                itemName={item.itemName}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
