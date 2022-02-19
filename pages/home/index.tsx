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
  ListItemIcon,
  Alert,
  AlertTitle
} from '@mui/material';
import NextLink from 'next/link';
import axios from 'axios';
import { Dump } from 'components/shared/Dump';
import Shell from 'components/shared/shell';
import { getItemsByFirebaseUserId } from 'data-layer/getItemsByFirebaseUserId';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import QRCode from 'qrcode.react';
import { z } from 'zod';
import { useAuth } from 'components/shared/auth/useAuth';
import { tryGetAuthToken } from 'utils/try-get-auth-token';

type ServerSideProps = {
  items: IItem[];
  baseUrl: string;
};
const ItemsPage: NextPage<ServerSideProps> = ({
  items: initialItems,
  baseUrl
}) => {
  const theme = useTheme();
  const { user } = useAuth();

  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);

  const getQueryProps = useQuery(
    ['GetItemById'],
    async () => {
      return (await axios.get<IItem[]>(`/api/items`)).data;
    },
    {
      initialData: initialItems,
      refetchOnWindowFocus: true
    }
  );

  useEffect(() => {
    getQueryProps.refetch();
  }, [user]);

  const deleteItem = async (itemSlug: string) => {
    await axios.delete(`/api/items/${itemSlug}`);
    getQueryProps.refetch();
  };
  const items = getQueryProps.data!;

  return (
    <Shell>
      <ConfirmDialog
        open={slugToDelete}
        setOpen={setSlugToDelete}
        beforeConfirm={() => deleteItem(slugToDelete!)}
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
          <Stack gap={1}>
            {user && user.isAnonymous && (
              <Alert severity="warning" elevation={1}>
                <AlertTitle>Don't lose your items!</AlertTitle>
                You are currently a guest, which means as soon as your session
                expires (when you close your browser), you won't be able to edit
                or print your codes
              </Alert>
            )}
            <Card>
              <CardHeader
                title="Your items"
                action={
                  <Stack
                    display={{ xs: 'none', sm: 'flex' }}
                    gap={1}
                    direction="row"
                  >
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
                              href={`/_/items/${item.itemSlug}`}
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
                                  setSlugToDelete(item.itemSlug);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        }
                      >
                        <NextLink href={`/${item.itemSlug}`} passHref>
                          <Link
                            color={theme.palette.text.primary}
                            underline="hover"
                            width={'100%'}
                          >
                            <ListItemButton>
                              <ListItemIcon>
                                <QRCode
                                  value={`${baseUrl}/${item.itemSlug}`}
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
                <Stack display={{ xs: 'flex', sm: 'none' }} padding={1} gap={1}>
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
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Shell>
  );
};

export default ItemsPage;

export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async ctx => {
  const baseUrl = z.string().url().parse(process.env.ORIGIN);

  const tokenAttempt = await tryGetAuthToken(['getServerSideProps', ctx]);
  if (!tokenAttempt.success) {
    switch (tokenAttempt.reason) {
      case 'expired':
        return {
          redirect: {
            destination: `/auth/refresh?redirecturl=/_/items`,
            permanent: false
          }
        } as const;
      case 'unauthenticated':
        return {
          redirect: {
            destination: `/`,
            permanent: false
          }
        } as const;
      default:
        throw new TypeError('Unsupported tokenAttempt.reason');
    }
  }
  const token = tokenAttempt.token;

  const items = await getItemsByFirebaseUserId(token.uid!);

  if (items) {
    return {
      props: { items, baseUrl }
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
