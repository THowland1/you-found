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
  CardContent
} from '@mui/material';
import { Dump } from 'components/shared/Dump';
import Shell from 'components/shared/shell';
import { getItemsByEmailAddress } from 'data-layer/getItemsByEmailAddress';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import React from 'react';

type ServerSideProps = { items: IItem[] };
const ItemsPage: NextPage<ServerSideProps> = ({ items }) => {
  const theme = useTheme();
  return (
    <Shell>
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
            <CardHeader title="Your items" />
            <CardContent sx={{ padding: 0 }}>
              <List sx={{ width: '100%' }}>
                {items.map((item, i) => (
                  <React.Fragment key={i}>
                    <ListItem disableGutters>
                      <Link
                        href={`/${(item as any).id}`}
                        underline="none"
                        color={'inherit'}
                        width={'100%'}
                      >
                        <ListItemButton>
                          <ListItemText sx={{ paddingX: '1rem' }}>
                            {item.itemName}
                          </ListItemText>
                        </ListItemButton>
                      </Link>
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

export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async ctx => {
  const cookies = nookies.get(ctx);
  const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

  const items = await getItemsByEmailAddress(token.email!);

  if (items) {
    return { props: { items } };
  } else {
    return {
      redirect: { destination: '404', statusCode: 404, permanent: false },
      props: {}
    };
  }
};
