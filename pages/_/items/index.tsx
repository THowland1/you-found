import { Add, Delete, Edit, Print, QrCode2 } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  Paper,
  Typography,
  CardHeader,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Box,
  ListItemIcon
} from '@mui/material';
import NextLink from 'next/link';
import axios from 'axios';
import { Dump } from 'components/shared/Dump';
import Shell from 'components/shared/shell';
import { getItemsByEmailAddress } from 'data-layer/getItemsByEmailAddress';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import QRCode from 'qrcode.react';
import { z } from 'zod';

type ServerSideProps = {
  items: IItem[];
  userEmailAddress: string;
  baseUrl: string;
};
const ItemsPage: NextPage<ServerSideProps> = ({
  items: initialItems,
  userEmailAddress,
  baseUrl
}) => {
  const theme = useTheme();

  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const getQueryProps = useQuery(
    ['GetItemById'],
    async () => {
      return (
        await axios.get<IItem[]>(`/api/items`, {
          params: { emailAddress: userEmailAddress }
        })
      ).data;
    },
    {
      initialData: initialItems
    }
  );
  const deleteItem = async (itemId: string) => {
    await axios.delete(`/api/items/${itemId}`);
    getQueryProps.refetch();
  };
  const items = getQueryProps.data!;

  return (
    <Shell>
      <ConfirmDialog
        open={idToDelete}
        setOpen={setIdToDelete}
        beforeConfirm={() => deleteItem(idToDelete!)}
      />
      <Grid
        container
        maxWidth={theme.breakpoints.values.sm}
        margin={'auto'}
        paddingX={{ xs: '1rem', sm: '2rem' }}
        gap="2rem"
        paddingY={'2rem'}
        direction={'column'}
      >
        <Grid item>
          <Card>
            <CardHeader
              title="Your items"
              action={
                <Stack gap={1} direction="row">
                  <NextLink href="/me/print" passHref>
                    <Button variant="outlined" startIcon={<QrCode2 />}>
                      Print QR codes
                    </Button>
                  </NextLink>
                  <NextLink href="/_/new" passHref>
                    <Button variant="contained" startIcon={<Add />}>
                      Add new
                    </Button>
                  </NextLink>
                </Stack>
              }
            />
            <CardContent sx={{ padding: 0 }}>
              <List sx={{ width: '100%' }}>
                {items.map((item, i) => (
                  <React.Fragment key={i}>
                    <ListItem
                      disablePadding
                      secondaryAction={
                        <Stack direction="row" gap=".5rem">
                          <NextLink
                            href={'./items/' + (item as any).id}
                            passHref
                          >
                            <Tooltip title="Edit">
                              <IconButton edge="end" aria-label="edit">
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          </NextLink>
                          <Tooltip title="Delete">
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={e => {
                                e.preventDefault();
                                setIdToDelete((item as any).id);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      }
                    >
                      <NextLink href={`/${(item as any).id}`} passHref>
                        <Link
                          color={theme.palette.text.primary}
                          underline="hover"
                          width={'100%'}
                        >
                          <ListItemButton>
                            <ListItemIcon>
                              <QRCode
                                value={`${baseUrl}/${(item as any).id}`}
                                renderAs="svg"
                                height={'2rem'}
                                width={'2rem'}
                              />
                            </ListItemIcon>
                            <ListItemText>{item.itemName}</ListItemText>
                          </ListItemButton>
                        </Link>
                      </NextLink>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Shell>
  );
};

export default ItemsPage;

async function tryVerifyIdToken(idToken: string) {
  try {
    const token = await firebaseAdmin.auth().verifyIdToken(idToken);
    return { success: true, token } as const;
  } catch {
    return { success: false } as const;
  }
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async ctx => {
  const baseUrl = z.string().url().parse(process.env.ORIGIN);

  const cookies = nookies.get(ctx);

  const tokenAttempt = await tryVerifyIdToken(cookies.token);
  if (!tokenAttempt.success) {
    return {
      redirect: {
        destination: `/auth/refresh?redirecturl=/_/items`,
        permanent: false
      }
    } as const;
  }
  const token = tokenAttempt.token;

  const items = await getItemsByEmailAddress(token.email!);

  if (items) {
    return {
      props: { items, userEmailAddress: token.email!, baseUrl }
    } as const;
  } else {
    return {
      redirect: { destination: '404', statusCode: 301 }
    } as const;
  }
};

type AlertDialogProps = {
  open: string | null;
  setOpen: (state: string | null) => any;
  beforeConfirm: () => Promise<void>;
};
export function ConfirmDialog({
  open,
  setOpen,
  beforeConfirm
}: AlertDialogProps) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    await beforeConfirm();
    setLoading(false);
    setOpen(null);
  };

  const handleClose = async () => {
    setOpen(null);
  };

  return (
    <div>
      <Dialog
        open={!!open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete item</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you wish to delete this item?
            <br />
            Once confirmed, it cannot be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            variant="contained"
            color="error"
            onClick={handleConfirm}
          >
            Delete item
          </LoadingButton>
          <Button onClick={handleClose} autoFocus>
            Keep item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
