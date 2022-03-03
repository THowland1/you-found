import {
  Add,
  Delete,
  Edit,
  Email,
  Phone,
  Print,
  QrCode2
} from '@mui/icons-material';
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
  AlertTitle,
  TextField,
  Chip
} from '@mui/material';
import NextLink from 'next/link';
import axios from 'axios';
import { Dump } from 'components/shared/Dump';
import Shell from 'components/shared/shell';
import { getItemsByFirebaseUserId } from 'data-layer/getItemsByFirebaseUserId';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { IItem, IItemEvent, IItemEventSchema } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import QRCode from 'qrcode.react';
import { z } from 'zod';
import { useAuth } from 'components/shared/auth/useAuth';
import { tryGetAuthToken } from 'utils/try-get-auth-token';
import { Formik, Form } from 'formik';
import FormikTextField from 'components/fields/FormikTextField';
import { useAuthService } from 'utils/hooks/useAuthService';
import { PhoneNumberField } from './PhoneNumberField';
import * as NS from 'utils/next-serialise';
import { formatDistance } from 'date-fns';

type ItemEvent = IItemEvent & { item: Pick<IItem, 'itemName'> };

type ServerSideProps = {
  items: IItem[];
  events: ItemEvent[];
  baseUrl: string;
};
const ItemsPage: NextPage<NS.Serialized<ServerSideProps>> = serialisedProps => {
  const {
    baseUrl,
    items: initialItems,
    events
  } = NS.deserialize<ServerSideProps>(serialisedProps);

  const theme = useTheme();
  const { user } = useAuth();
  const { linkWithPhoneNumber } = useAuthService();

  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);

  const [showPhoneNumberForm, setShowPhoneNumberForm] = useState(false);
  const [
    submitPhoneNumberConfirmationCode,
    setSubmitPhoneNumberConfirmationCode
  ] = useState<((code: string) => void) | null>(null);

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
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        margin={'auto'}
        marginTop="4rem"
        gap="2rem"
        justifyContent="center"
        paddingX={{ xs: '1rem', sm: '2rem' }}
      >
        <Stack paddingY={'2rem'} width="16rem">
          <Paper>
            <Stack
              justifyContent="center"
              alignItems="center"
              borderRadius="8rem"
              height="8rem"
              width="8rem"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontSize: '4rem',
                margin: 'auto',
                marginTop: '-4rem'
              }}
            >
              {user?.displayName
                ?.split(' ')
                ?.map(x => x.substring(0, 1))
                ?.join('')
                ?.substring(0, 2)
                .toUpperCase()}
            </Stack>
            <Stack p=".5rem" pb="1.5rem">
              <Stack p=".5rem">
                <Typography variant="h6" margin="auto">
                  {user?.displayName}
                </Typography>
              </Stack>

              <Stack>
                <Stack
                  p=".5rem"
                  direction="row"
                  alignItems="center"
                  sx={{ color: theme.palette.grey[700], fontSize: 'small' }}
                >
                  <Email fontSize="small" sx={{ mr: '0.5rem', opacity: 0.7 }} />
                  <span>
                    {user?.email}
                    {user?.emailVerified ? null : (
                      <Box letterSpacing="-.5px" fontSize=".8em">
                        Not verified&nbsp;&bull;&nbsp;
                        <Link
                          component="button"
                          underline="hover"
                          fontSize="1em"
                          onClick={_ => user?.sendEmailVerification()}
                        >
                          <em>Resend verification email</em>
                        </Link>
                      </Box>
                    )}
                  </span>
                </Stack>

                <Stack
                  p=".5rem"
                  direction="row"
                  alignItems="center"
                  sx={{ color: theme.palette.grey[700], fontSize: 'small' }}
                >
                  <Phone fontSize="small" sx={{ mr: '0.5rem', opacity: 0.7 }} />
                  {user?.phoneNumber ? (
                    <span>{user.phoneNumber}</span>
                  ) : (
                    <>
                      {showPhoneNumberForm ? (
                        <PhoneNumberField
                          user={user!}
                          onFinish={() => setShowPhoneNumberForm(false)}
                        />
                      ) : (
                        <Link
                          component="button"
                          underline="hover"
                          onClick={_ => setShowPhoneNumberForm(true)}
                        >
                          <span>
                            <em>Add phone number</em>
                          </span>
                        </Link>
                      )}
                    </>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
        <Grid
          container
          maxWidth={theme.breakpoints.values.sm}
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
                  expires (when you close your browser), you won't be able to
                  edit or print your codes
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
                  <Stack
                    display={{ xs: 'flex', sm: 'none' }}
                    padding={1}
                    gap={1}
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
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Activity" />
                <CardContent sx={{ padding: 0 }}>
                  <List sx={{ width: '100%' }}>
                    {events.map((itemEvent, i) => (
                      <React.Fragment key={i}>
                        <ListItem
                          sx={{
                            ':nth-child(odd)': {
                              background: theme => theme.palette.grey[50]
                            }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography variant="body1">
                                  Anonymous{' '}
                                  {
                                    {
                                      Visited: 'visited',
                                      MessageSent: 'sent a message'
                                    }[itemEvent.eventType]
                                  }{' '}
                                  <Box
                                    sx={{
                                      display: 'inline',
                                      fontSize: 'small',
                                      opacity: 0.5
                                    }}
                                  >
                                    ({itemEvent.item.itemName})
                                  </Box>
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontSize="small"
                                  sx={{ opacity: 0.5 }}
                                >
                                  {formatDistance(
                                    new Date(itemEvent.datetime),
                                    new Date(),
                                    { addSuffix: true }
                                  )}
                                </Typography>
                              </Stack>
                            }
                            secondary={
                              <>
                                {itemEvent.eventType === 'Visited' && (
                                  <>&nbsp;</>
                                )}
                                {itemEvent.eventType === 'MessageSent' && (
                                  <>"{itemEvent.messageSentProps.message}"</>
                                )}
                              </>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Shell>
  );
};

export default ItemsPage;

export const getServerSideProps: GetServerSideProps<
  NS.Serialized<ServerSideProps>
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

  const events: ItemEvent[] = [];
  items.forEach(item => {
    const newEvents: ItemEvent[] = item.events.map(itemEvent => ({
      ...itemEvent,
      item
    }));
    events.push(...newEvents);
  });
  events.sort((a, b) => b.datetime.valueOf() - a.datetime.valueOf());

  if (items) {
    return {
      props: NS.serialize({ items, baseUrl, events })
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
