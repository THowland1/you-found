import { Email, Phone, Sms, WhatsApp } from '@mui/icons-material';
import {
  Button,
  createTheme,
  Grid,
  Link,
  Typography,
  useTheme
} from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { IItem } from 'models/schema/item';
import { NextPage } from 'next';
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
        default: swatch.main.background
      },
      text: { primary: swatch.main.color }
    }
  });

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
                          href={'https://wa.me/' + link.phoneNumber}
                          buttonText={link.buttonText}
                          icon={<WhatsApp />}
                        />
                      )}
                      {link.linkType === 'email' && (
                        <LinkButton
                          href={'mailto:' + link.emailAddress}
                          buttonText={link.buttonText}
                          icon={<Email />}
                        />
                      )}
                      {link.linkType === 'sms' && (
                        <LinkButton
                          href={'sms:' + link.phoneNumber}
                          buttonText={link.buttonText}
                          icon={<Sms />}
                        />
                      )}
                      {link.linkType === 'call' && (
                        <LinkButton
                          href={'tel:' + link.phoneNumber}
                          buttonText={link.buttonText}
                          icon={<Phone />}
                        />
                      )}
                    </Grid>
                  )
              )}

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
  icon: React.ReactNode;
  buttonText: string;
};
function LinkButton(props: LinkButtonProps) {
  return (
    <Link href={props.href} underline="none">
      <Button
        fullWidth
        variant="contained"
        startIcon={props.icon}
        sx={{ paddingY: '1rem' }}
      >
        {props.buttonText}
      </Button>
    </Link>
  );
}
