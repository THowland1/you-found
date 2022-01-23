import { Add, Delete, Edit, Print } from '@mui/icons-material';
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
  Link,
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
  DialogTitle
} from '@mui/material';
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

type ServerSideProps = { items: IItem[]; userEmailAddress: string };
const ItemsPage: NextPage<ServerSideProps> = ({
  items: initialItems,
  userEmailAddress
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
                <Link underline="none" href="/_/new">
                  <Button variant="contained" startIcon={<Add />}>
                    Add new
                  </Button>
                </Link>
              }
            />
            <CardContent sx={{ padding: 0 }}>
              <List sx={{ width: '100%' }}>
                {items.map((item, i) => (
                  <React.Fragment key={i}>
                    <ListItem disableGutters>
                      <ListItemButton>
                        <ListItemText sx={{ paddingX: '1rem' }}>
                          <Stack direction="row" alignItems="center">
                            <Link
                              href={`/${(item as any).id}`}
                              underline="hover"
                              color={'inherit'}
                              width={'100%'}
                            >
                              {item.itemName}
                            </Link>
                            <Stack direction="row" gap=".5rem">
                              <Link
                                underline="none"
                                href={`./items/${(item as any).id}/print`}
                              >
                                <Tooltip title="Print">
                                  <IconButton
                                    edge="end"
                                    aria-label="print"
                                    onClick={e => {
                                      console.log(123);
                                    }}
                                  >
                                    <Print />
                                  </IconButton>
                                </Tooltip>
                              </Link>
                              <Link
                                underline="none"
                                href={'./items/' + (item as any).id}
                              >
                                <Tooltip title="Edit">
                                  <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={e => {
                                      console.log(123);
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                              </Link>
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
                          </Stack>
                        </ListItemText>
                      </ListItemButton>
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
    return { props: { items, userEmailAddress: token.email! } } as const;
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
