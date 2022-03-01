import { ArrowForward, ArrowRight } from '@mui/icons-material';
import Image from 'next/image';
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Theme,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/system';
import Shell from 'components/shared/shell';
import { NavBar } from 'components/shared/shell/NavBar';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { honeycomb } from 'styles/backgrounds';
import NextLink from 'next/link';
import { tryGetAuthToken } from 'utils/try-get-auth-token';
import { GetServerSideProps, NextPage } from 'next';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { useAuth } from 'components/shared/auth/useAuth';
import { AuthPopup } from 'components/shared/shell/NavBar/AuthPopup';
import LandingPage from 'components/items/LandingPage';
import { IItem } from 'models/schema/item';
import Phone from 'components/shared/Phone';

const exampleIItem: IItem = {
  itemId: 0,
  itemSlug: '',
  firebaseUserId: '',
  headline: 'Hey! You found my power bank!',
  itemName: 'Book',
  message: 'I would appreciate if you could get in touch so I can have it back',
  events: [],
  links: [
    {
      showButton: true,
      buttonText: 'Message me on WhatsApp',
      linkType: 'whatsapp',
      phoneNumber: ''
    },
    {
      showButton: true,
      buttonText: 'Send me a text',
      linkType: 'sms',
      phoneNumber: ''
    },
    {
      showButton: true,
      buttonText: 'Email me',
      linkType: 'email',
      emailAddress: ''
    }
  ]
};

type ServerSideProps = { token: DecodedIdToken | null };
const Home: NextPage<ServerSideProps> = ({ token }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(token));
  const [popupOpen, setPopupOpen] = useState(false);
  const theme = useTheme<Theme>();
  const { user } = useAuth();

  useEffect(() => {
    setIsLoggedIn(Boolean(user));
  }, [user]);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell>
        <>
          <AuthPopup open={popupOpen} setOpen={setPopupOpen} />
          <Box position="relative" minHeight="75vh">
            <Grid sx={{ position: 'absolute', inset: 0 }}>
              <Image
                alt="Mountains"
                src="/hero.jpeg"
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </Grid>
            <Grid
              sx={{ position: 'absolute', inset: 0, bgcolor: '#fff3' }}
            ></Grid>
            <Grid
              sx={{ position: 'absolute', inset: 0 }}
              container
              maxWidth="sm"
              alignItems="center"
              justifyContent="center"
              margin={'auto'}
              paddingX={{ xs: '1rem', sm: '2rem' }}
              paddingY={'2rem'}
              gap={'2rem'}
              flexDirection="column"
            >
              <Typography variant="h1" textAlign="center" color="textPrimary">
                Never lose anything&nbsp;again
              </Typography>
              <Typography
                variant="h4"
                component="p"
                textAlign="center"
                color="textPrimary"
              >
                Stick QR tags on/in your precious items and let kind strangers
                get in touch to return them
              </Typography>
              <NextLink href="/_/new" passHref>
                <Button fullWidth size="large" variant="contained">
                  Create a code
                </Button>
              </NextLink>
              <div>
                Already a member?{' '}
                <Link
                  underline="hover"
                  onClick={() => setPopupOpen(true)}
                  component="button"
                  type="button"
                  fontSize="inherit"
                >
                  Log in
                </Link>
              </div>
            </Grid>
          </Box>
          <Stack>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              p="2rem"
              gap="2rem"
              maxWidth="lg"
              width="100%"
              m="auto"
            >
              <Stack flex={1} alignItems="center" justifyContent="center">
                <Box pb={{ md: '7rem' }}>
                  <Typography variant="h2">How it works</Typography>
                  <ol>
                    <li>You create some codes with contact details</li>
                    <li>You print out the codes as stickers</li>
                    <li>You stick them on your valuables</li>
                    <li>You lose the items (well, try not to)</li>
                    <li>A kind stranger finds your item</li>
                    <li>A kind stranger scans your code and gets in touch</li>
                    <li>You get your item back</li>
                    <li>
                      (optional) You get the kind stranger a coffee or something
                    </li>
                  </ol>
                </Box>
              </Stack>
              <Stack flex={1}>
                <Phone item={exampleIItem} />
              </Stack>
            </Stack>
          </Stack>
          <Stack>
            <Stack p="2rem" gap="2rem" maxWidth="lg" width="100%" m="auto">
              <Paper
                sx={{
                  backgroundColor: '#cae5f2',
                  padding: '2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="body1">
                    <strong>What are you waiting for?</strong>
                  </Typography>
                  <Typography variant="body1">
                    Get making your codes now!
                  </Typography>
                </Box>
                <Box>
                  <NextLink href="/_/new" passHref>
                    <Button fullWidth variant="contained">
                      Create a code
                    </Button>
                  </NextLink>
                </Box>
              </Paper>
            </Stack>
          </Stack>
          <Stack
            component="footer"
            sx={{
              backgroundColor: theme.palette.grey[900],
              color: theme.palette.grey[500]
            }}
          >
            <Stack
              maxWidth="lg"
              width="100%"
              m="auto"
              p="2rem"
              direction="row"
              justifyContent="space-between"
            >
              <span>&copy; 2022 Tom Howland</span>
              <span>
                <Link
                  underline="hover"
                  color="inherit"
                  href="mailto:tom@tomhowland.com"
                >
                  Contact
                </Link>
              </span>
            </Stack>
          </Stack>
        </>
      </Shell>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async ctx => {
  const tokenAttempt = await tryGetAuthToken(['getServerSideProps', ctx]);

  if (tokenAttempt.success) {
    return { props: { token: tokenAttempt.token } };
  }

  if (tokenAttempt.reason === 'expired') {
    return {
      redirect: {
        destination: `/auth/refresh?redirecturl=/`,
        permanent: false
      }
    };
  }

  return {
    props: {
      token: null
    }
  };
};

export function Section({
  href,
  h4Text,
  body1Text
}: {
  href: string;
  h4Text: string;
  body1Text: string;
}): JSX.Element {
  const theme = useTheme<Theme>();

  return (
    <NextLink href={href} passHref>
      <Link underline="none" color={'textPrimary'}>
        <Grid
          container
          sx={{
            background: theme.palette.background.default,
            padding: '1rem',
            border: `solid 1px ${theme.palette.grey[300]}`,
            borderRadius: '.5rem',
            boxShadow: theme.shadows[1],
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <Grid xs item>
            <Typography variant="h4">{h4Text}</Typography>
            <Typography variant="body1" color="GrayText">
              {body1Text}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton>
              <ArrowForward />
            </IconButton>
          </Grid>
        </Grid>
      </Link>
    </NextLink>
  );
}
