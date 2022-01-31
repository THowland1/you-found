import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  CheckboxProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormControlLabelProps,
  IconButton,
  Stack
} from '@mui/material';
import axios from 'axios';
import ItemForm from 'components/items/ItemForm';
import { INewItem } from 'models/new-item';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import QRCode from 'qrcode.react';
import { z } from 'zod';
import { IItem } from 'models/schema/item';
import PrintForm, { PrintFormItemSchema } from 'components/PrintForm';
import { Close } from '@mui/icons-material';

const initialValues: INewItem = {
  itemName: '',
  headline: '!',
  message: '!',
  phoneNumber: '',
  showWhatsAppLink: false,
  showPhoneCallLink: false,
  showSMSLink: false,

  emailAddress: '',
  showEmailLink: false
};

const NewPage: NextPage<ServerSideProps> = ({ origin }) => {
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const postNewItem = async (values: INewItem) => {
    const response = await axios.post<{ itemId: string }>('/api/items', {
      ...values,
      headline: `Hi, you've found my ${values.itemName}!`,
      message:
        'I would apprciate if you would reach out on via one of the methods below!'
    });
    setCreatedItemId(response.data.itemId);
  };

  return (
    <>
      <Head>
        <title>Register new code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <fieldset disabled={Boolean(createdItemId)}>
        <ItemForm initialValues={initialValues} onSubmit={postNewItem} />
      </fieldset>
      <SuccessDialog
        createdItemId={createdItemId}
        origin={origin}
      ></SuccessDialog>
    </>
  );
};

export default NewPage;

type ServerSideProps = { origin: string };
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query,
  req
}) => {
  const origin = z.string().url().parse(process.env.ORIGIN);
  return {
    props: { origin }
  };
};

type AlertDialogProps = {
  createdItemId: string | null;
  origin: string;
};
export function SuccessDialog({ createdItemId, origin }: AlertDialogProps) {
  const [loading, setLoading] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  return (
    <>
      <div>
        <Dialog
          open={!!createdItemId}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Your QR has been created
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{ maxWidth: '30rem' }}
              id="alert-dialog-description"
            >
              <Stack gap={2}>
                <Stack direction="row" gap={2} alignItems={'center'}>
                  <QRCode
                    height={'auto'}
                    value={`${origin}/${createdItemId}`}
                    renderAs="svg"
                  />
                  <Box>
                    Congratulations! Your QR code has been created!
                    <br />
                    Feel free to stick it on things to let people return them to
                    you if they get lost
                  </Box>
                </Stack>
                <Stack gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => setPrintDialogOpen(true)}
                  >
                    Print this code out
                  </Button>
                  <Button disabled variant="outlined">
                    Stylise the page
                  </Button>
                  <Button disabled variant="outlined">
                    Create another
                  </Button>
                  <Button disabled variant="outlined">
                    See all your codes
                  </Button>
                </Stack>
              </Stack>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
      <PrintDialog
        open={printDialogOpen}
        setOpen={setPrintDialogOpen}
        item={
          {
            id: createdItemId,
            itemHref: `/${origin}/${createdItemId}`,
            itemName: ''
          } as any
        }
        baseUrl={origin}
      />
    </>
  );
}

// FIND OUT A WAY TO CLOSE THE DIALOG
type PrintDialogProps = {
  open: boolean;
  setOpen: (state: boolean) => any;
  item: PrintFormItemSchema;
  baseUrl: string;
};
function PrintDialog({ open, setOpen, item, baseUrl }: PrintDialogProps) {
  return (
    <Dialog fullScreen open={open} sx={{ inset: { sm: '1rem' } }}>
      <DialogContent sx={{ position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1 }}
          onClick={() => setOpen(false)}
        >
          <Close></Close>
        </IconButton>
        <DialogContentText>
          <PrintForm items={[item]} baseUrl={baseUrl} />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
