import { Email, Phone, Sms, WhatsApp } from '@mui/icons-material';
import { Button, Grid, Link, Typography, useTheme } from '@mui/material';
import { getItemByItemSlug } from 'data-layer/getItemByItemSlug';
import { IItem } from 'models/schema/item';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { honeycomb } from 'styles/backgrounds';
import { z } from 'zod';

type ServerSideProps = { item: IItem };
const LandingPage: NextPage<ServerSideProps> = ({ item }) => {
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
            maxWidth={theme.breakpoints.values.sm}
            margin={'auto'}
            paddingX={{ xs: '1rem', sm: '2rem' }}
            paddingY={'2rem'}
          >
            <Typography variant="h2">{item.headline}</Typography>
          </Grid>
        </Grid>
        <Grid
          item
          xs
          sx={{
            background: honeycomb(
              theme.palette.background.default,
              theme.palette.grey[200]
            )
          }}
        >
          <Grid
            container
            maxWidth={theme.breakpoints.values.sm}
            margin="auto"
            direction="column"
            gap={2}
            padding={{ xs: 1, sm: 2 }}
          >
            <Typography variant="h3">{item.message}</Typography>
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

            <Grid item margin="auto">
              <Link href={'/'} underline="hover">
                Powered by YouFound
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
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
