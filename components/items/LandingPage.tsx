import {
  ArrowRightAlt,
  Email,
  Phone,
  Sms,
  WhatsApp
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  ButtonProps,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { alpha, ThemeProvider } from '@mui/system';
import axios from 'axios';
import FormikTextField from 'components/fields/FormikTextField';
import { Form, Formik } from 'formik';
import { IItem, IItemEvent } from 'models/schema/item';
import { NextPage } from 'next';
import { getRoute } from 'next-type-safe-routes';
import React from 'react';

type LandingPageTheme = {
  header: {
    background: string;
    color: string;
  };
  main: {
    paddingTop: boolean;
    background: string;
    color: string;
    button: {
      backgroundColor: string;
      color: string;
    };
    link: {
      color: string;
    };
  };
};

const LANDING_PAGE_THEMES: Record<
  'slack' | 'default' | 'msteams',
  LandingPageTheme
> = {
  default: {
    header: {
      background: '#4A154B',
      color: '#FFF'
    },
    main: {
      paddingTop: true,
      background: '#FFF',
      color: '#4A154B',
      button: {
        backgroundColor: '#4A154B',
        color: '#FFF'
      },
      link: {
        color: '#4A154B'
      }
    }
  },
  msteams: {
    header: {
      background: '#26223D',
      color: '#FFF'
    },
    main: {
      paddingTop: false,
      background: '#26223D',
      color: '#FFF',
      button: {
        backgroundColor: '#6264A7',
        color: '#FFF'
      },
      link: {
        color: '#6264A7'
      }
    }
  },
  slack: {
    header: {
      background: '#4A154B',
      color: '#FFF'
    },
    main: {
      paddingTop: false,
      background: '#4A154B',
      color: '#FFF',
      button: {
        backgroundColor: '#1064A3',
        color: '#FFF'
      },
      link: {
        color: '#36c5f0'
      }
    }
  }
};

type ServerSideProps = { item: IItem };
const LandingPage: NextPage<ServerSideProps> = ({ item }) => {
  const theme = useTheme();

  const swatch = LANDING_PAGE_THEMES.msteams;

  const bodyTheme = createTheme({
    ...theme,

    breakpoints: {
      values: {
        xs: 0,
        sm: 9999,
        md: 9999,
        lg: 9999,
        xl: 9999
      }
    }
  });
  const headerTheme = createTheme({
    ...bodyTheme,
    palette: {
      ...bodyTheme.palette,
      background: {
        default: swatch.header.background
      },
      text: { primary: swatch.header.color }
    }
  });
  const mainTheme = createTheme({
    ...bodyTheme,

    palette: {
      ...bodyTheme.palette,
      primary: {
        main: swatch.main.button.backgroundColor,
        contrastText: swatch.main.button.color
      },
      info: {
        main: swatch.main.link.color
      },
      background: {
        default: swatch.main.background,
        paper: swatch.main.background
      },
      text: { primary: swatch.main.color }
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: alpha(swatch.main.color, 0.2)
          }
        }
      }
    }
  });

  async function sendOneWayMessage(message: string) {
    const route = getRoute({
      route: '/api/items/[itemSlug]/events',
      params: { itemSlug: item.itemSlug }
    });
    const response = await axios.post<IItemEvent>(route, {
      eventType: 'MessageSent',
      datetime: new Date(),
      messageSentProps: {
        message
      }
    });
  }

  return (
    <ThemeProvider theme={bodyTheme}>
      <Grid
        container
        direction={'column'}
        flexWrap={'nowrap'}
        sx={{
          position: 'absolute',
          inset: 0
        }}
      >
        <ThemeProvider theme={headerTheme}>
          <Grid
            item
            sx={{
              background: theme => theme.palette.background.default,
              color: theme => theme.palette.text.primary
            }}
          >
            <Grid
              container
              maxWidth={theme.breakpoints.values.sm}
              margin={'auto'}
              padding={'1.5rem'}
            >
              <Typography variant="h2">{item.headline}</Typography>
            </Grid>
          </Grid>
        </ThemeProvider>
        <ThemeProvider theme={mainTheme}>
          <Grid
            item
            xs
            sx={{
              background: theme => theme.palette.background.default
            }}
          >
            <Grid
              container
              maxWidth={theme.breakpoints.values.sm}
              margin="auto"
              direction="column"
              gap="1.5rem"
              padding="1.5rem"
              paddingTop={swatch.main.paddingTop ? undefined : 0}
            >
              <Typography
                variant="h4"
                sx={{ opacity: 0.5 }}
                color={theme => theme.palette.text.primary}
              >
                {item.message}
              </Typography>
              {item.links.map(
                (link, index) =>
                  link.showButton && (
                    <Grid item key={index}>
                      {link.linkType === 'whatsapp' && (
                        <LinkButton
                          fullWidth
                          variant="contained"
                          startIcon={<WhatsApp />}
                          sx={{ paddingY: '1rem' }}
                          href={'https://wa.me/' + link.phoneNumber}
                        >
                          {link.buttonText}
                        </LinkButton>
                      )}
                      {link.linkType === 'email' && (
                        <LinkButton
                          fullWidth
                          variant="contained"
                          startIcon={<Email />}
                          sx={{ paddingY: '1rem' }}
                          href={'mailto:' + link.emailAddress}
                        >
                          {link.buttonText}
                        </LinkButton>
                      )}
                      {link.linkType === 'sms' && (
                        <LinkButton
                          fullWidth
                          variant="contained"
                          startIcon={<Sms />}
                          sx={{ paddingY: '1rem' }}
                          href={'sms:' + link.phoneNumber}
                        >
                          {link.buttonText}
                        </LinkButton>
                      )}
                      {link.linkType === 'call' && (
                        <LinkButton
                          fullWidth
                          variant="contained"
                          startIcon={<Phone />}
                          sx={{ paddingY: '1rem' }}
                          href={'tel:' + link.phoneNumber}
                        >
                          {link.buttonText}
                        </LinkButton>
                      )}
                    </Grid>
                  )
              )}
              <DialogButton
                fullWidth
                variant="contained"
                startIcon={<ArrowRightAlt />}
                sx={{ paddingY: '1rem' }}
                onSubmit={message => sendOneWayMessage(message)}
              >
                Send a one-way message
              </DialogButton>

              <Grid item marginX="auto" marginTop="3rem">
                <Link href={'/'} underline="hover" color="info.main">
                  Powered by YouFound
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Grid>
    </ThemeProvider>
  );
};

export default LandingPage;

type LinkButtonProps = {
  href: string;
} & ButtonProps;
function LinkButton({ href, ...props }: LinkButtonProps) {
  return (
    <Link href={href} underline="none">
      <Button {...props} />
    </Link>
  );
}

type DialogButtonProps = {
  onSubmit: (text: string) => void | Promise<void>;
} & Omit<ButtonProps, 'onSubmit'>;
function DialogButton({ onSubmit, ...props }: DialogButtonProps) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClose = () => setOpen(false);

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (text: string) => {
    setLoading(true);
    onSubmit(text);
    setLoading(false);
    handleClose();
  };

  return (
    <>
      <Button disabled={open} onClick={_ => setOpen(!open)} {...props} />
      <Dialog
        fullWidth
        open={!!open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Formik
          initialValues={{ text: '' }}
          onSubmit={values => handleSubmit(values.text)}
        >
          {({ submitForm, values }) => (
            <Form>
              <DialogTitle id="alert-dialog-title">
                Send a one-way message
              </DialogTitle>
              <DialogContent>
                <FormikTextField
                  name="text"
                  placeholder="e.g. I found your book at the cafe on the corner and left it at the counter"
                  fullWidth
                  minRows={3}
                  multiline
                  autoFocus
                />
              </DialogContent>
              <DialogActions>
                <Button type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  onClick={_ => submitForm()}
                >
                  Send
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
