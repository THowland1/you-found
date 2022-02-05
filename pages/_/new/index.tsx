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
  Grow,
  IconButton,
  Stack
} from '@mui/material';
import axios from 'axios';
import ItemForm from 'components/items/ItemForm';
import { INewItem } from 'models/new-item';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import { z } from 'zod';
import { IItem } from 'models/schema/item';
import PrintForm, { PrintFormItemSchema } from 'components/PrintForm';
import { Close } from '@mui/icons-material';
import Link from 'next/link';
import { FormikProps } from 'formik';
import { useAuthService } from 'utils/hooks/useAuthService';
import { useAuth } from 'components/shared/auth/useAuth';
import nookies from 'nookies';

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
  const { registerAnonymously } = useAuthService();
  const { user } = useAuth();
  const [createdItem, setCreatedItem] = useState<IItem | null>(null);
  const formikRef = useRef<FormikProps<INewItem>>(null);

  const reset = () => {
    setCreatedItem(null);
    formikRef.current?.resetForm();
  };

  const postNewItem = async (values: INewItem) => {
    if (!user) {
      const result = await registerAnonymously();
      if (result.success) {
        const token = await result.userCredential.user!.getIdToken();
        nookies.set(undefined, 'token', token, {
          path: '/'
        });
      }
    }

    const response = await axios.post<IItem>('/api/items', {
      ...values,
      headline: `Hi, you've found my ${values.itemName}!`,
      message:
        'I would apprciate if you would reach out on via one of the methods below!'
    });
    setCreatedItem(response.data);
  };

  return (
    <>
      <Head>
        <title>Register new code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ItemForm
        formikRef={formikRef}
        initialValues={initialValues}
        onSubmit={postNewItem}
      />
      <SuccessDialog
        reset={reset}
        createdItem={createdItem}
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
  createdItem: IItem | null;
  origin: string;
  reset: () => void;
};
export function SuccessDialog({
  createdItem,
  origin,
  reset
}: AlertDialogProps) {
  const [loading, setLoading] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  return (
    <>
      <div>
        <Dialog
          open={!!createdItem}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Your QR has been created
          </DialogTitle>
          <DialogContent
            sx={{ maxWidth: '32rem' }}
            id="alert-dialog-description"
          >
            <Stack gap={2}>
              <Stack direction="row" gap={2} alignItems={'center'}>
                <QRCode
                  height={'auto'}
                  value={`${origin}/${createdItem?.itemSlug}`}
                  renderAs="svg"
                />
                <Box>
                  <DialogContentText>
                    Congratulations! Your QR code has been created!
                    <br />
                    Feel free to stick it on things to let people return them to
                    you if they get lost
                  </DialogContentText>
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
                <Button onClick={() => reset()} variant="outlined">
                  Create another
                </Button>
                <Link href="/_/items" passHref>
                  <Button variant="outlined">See all your codes</Button>
                </Link>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      </div>
      {createdItem && (
        <PrintDialog
          open={printDialogOpen}
          setOpen={setPrintDialogOpen}
          item={createdItem}
          baseUrl={origin}
        />
      )}
    </>
  );
}

type PrintDialogProps = {
  open: boolean;
  setOpen: (state: boolean) => any;
  item: IItem;
  baseUrl: string;
};
function PrintDialog({ open, setOpen, item, baseUrl }: PrintDialogProps) {
  return (
    <Dialog
      TransitionComponent={Grow}
      fullScreen
      open={open}
      sx={{ inset: { sm: '1rem' } }}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1 }}
          onClick={() => setOpen(false)}
        >
          <Close></Close>
        </IconButton>
        <PrintForm items={[item]} baseUrl={baseUrl} />
      </DialogContent>
    </Dialog>
  );
}
