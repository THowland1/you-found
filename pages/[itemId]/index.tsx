import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Email, Phone, Sms, WhatsApp } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
  Grid,
  Link,
  Paper,
  TextField,
  TextFieldProps,
  Typography,
  useTheme
} from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Dump } from 'components/shared/Dump';
import { Field, Form, Formik, useField } from 'formik';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { getItemById } from '../api/items/[itemId]/index';

type ServerSideProps = { item: IItem };
const ItemPage: NextPage<ServerSideProps> = ({ item }) => {
  const theme = useTheme();
  return (
    <>
      <Grid
        container
        direction={'column'}
        flexWrap={'nowrap'}
        sx={{
          position: 'absolute',
          inset: 0
        }}
      >
        <Grid
          item
          sx={{
            backgroundColor: theme.palette.grey[900],
            color: theme.palette.getContrastText(theme.palette.grey[900])
          }}
        >
          <Grid
            container
            maxWidth={'500px'}
            margin={'auto'}
            sx={{
              padding: '2rem',
              [theme.breakpoints.down('sm')]: {
                padding: '1rem'
              }
            }}
          >
            <Typography variant="h2">{item.headline}</Typography>
          </Grid>
        </Grid>
        <Grid
          item
          xs
          sx={{
            background: `
            
            radial-gradient(circle farthest-side at 0% 50%,${theme.palette.background.default} 23.5%,rgba(240,166,17,0) 0)21px 30px,
            radial-gradient(circle farthest-side at 0% 50%,${theme.palette.grey[200]} 24%,rgba(240,166,17,0) 0)19px 30px,
            linear-gradient(${theme.palette.background.default} 14%,rgba(240,166,17,0) 0, rgba(240,166,17,0) 85%,${theme.palette.background.default} 0)0 0,
            linear-gradient(150deg,${theme.palette.background.default} 24%,${theme.palette.grey[200]} 0,${theme.palette.grey[200]} 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,${theme.palette.grey[200]} 0,${theme.palette.grey[200]} 76%,${theme.palette.background.default} 0)0 0,
            linear-gradient(30deg,${theme.palette.background.default} 24%,${theme.palette.grey[200]} 0,${theme.palette.grey[200]} 26%,rgba(240,166,17,0) 0,rgba(240,166,17,0) 74%,${theme.palette.grey[200]} 0,${theme.palette.grey[200]} 76%,${theme.palette.background.default} 0)0 0,
            linear-gradient(90deg,${theme.palette.grey[200]} 2%,${theme.palette.background.default} 0,${theme.palette.background.default} 98%,${theme.palette.grey[200]} 0%)0 0 ${theme.palette.background.default};
            background-size: 40px 60px;
          `
          }}
        >
          <Grid
            container
            maxWidth={'500px'}
            margin={'auto'}
            direction="column"
            gap="2rem"
            sx={{
              padding: '2rem',
              [theme.breakpoints.down('sm')]: {
                padding: '1rem'
              }
            }}
          >
            <Typography variant="h3">{item.message}</Typography>
            <Grid item>
              <Link href={'https://wa.me/' + item.phoneNumber} underline="none">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsApp />}
                  sx={{ paddingY: '1rem' }}
                >
                  Message me on whatsapp
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href={'sms:' + item.phoneNumber} underline="none">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Sms />}
                  sx={{ paddingY: '1rem' }}
                >
                  Send me a text
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href={'tel:' + item.phoneNumber} underline="none">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Phone />}
                  sx={{ paddingY: '1rem' }}
                >
                  Give me a call
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href={'https://m.me:' + item.phoneNumber} underline="none">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={
                    <FontAwesomeIcon icon={faFacebookMessenger} size="2x" />
                  }
                  sx={{ paddingY: '1rem' }}
                >
                  Message me on Messenger
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href={'mailto:' + item.emailAddress} underline="none">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Email />}
                  sx={{ paddingY: '1rem' }}
                >
                  Email me
                </Button>
              </Link>
            </Grid>

            <Grid item margin="auto">
              <Link href={'/'} underline="hover">
                Powered by YouFound
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
    // <div className={styles.page}>s
    //   <header className={styles.header}>
    //     <p>
    //       Hi, I'm <mark>{user.userFullName}</mark> and you have found my{' '}
    //       <mark>{item.itemName}</mark>
    //     </p>
    //   </header>
    //   <main className={styles.main}>
    //     <div className={styles.cta}>
    //       I would appreciate it if you could get in touch, and I'd be happy to
    //       come and get it
    //     </div>
    //     <a
    //       className={styles.contactMethod}
    //       href={'mailto:' + user.userEmailAddress}
    //     >
    //       <FontAwesomeIcon icon={faEnvelope} />
    //       <span className={styles.a}>By email</span>
    //     </a>
    //     <a
    //       className={styles.contactMethod}
    //       href={'sms:' + user.userPhoneNumber}
    //     >
    //       <FontAwesomeIcon icon={faComments} />
    //       <span className={styles.a}>By text</span>
    //     </a>
    //     <a
    //       className={styles.contactMethod}
    //       href={'https://wa.me/' + user.userPhoneNumber}
    //     >
    //       <FontAwesomeIcon icon={faWhatsapp} />
    //       <span className={styles.a}>By WhatsApp</span>
    //     </a>
    //   </main>
    // </div>
  );
};

export default ItemPage;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query
}) => {
  const itemId = z.string().parse(query.itemId);
  const item = await getItemById(itemId);

  console.log(item);
  if (item) {
    return { props: { item } };
  } else {
    return {
      redirect: { destination: '404', statusCode: 404, permanent: false },
      props: {}
    };
  }
};
