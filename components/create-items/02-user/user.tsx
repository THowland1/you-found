import {
  Button,
  InputAdornment,
  List,
  ListItem,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';
import { Lock, Mail } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import axios, { AxiosError } from 'axios';
import { LogIn } from 'models/api';
import LogoPortrait from 'public/logo-landscape.svg';
import React, { useState } from 'react';
import { Step } from '../step';
import { SubformParams } from '../subform-params';
import { UserApiClient } from './user-api-client';
import { NewOrExisting, UserSubform } from './user-subform';
import styles from './user.module.scss';

type Params = SubformParams;

export default function CreateItemsUser({ form, setForm }: Params) {
  const [error, setError] = useState<any>(null);
  const [userSubform, setUserSubform] = useState(form['02-user']);
  function setSubformAndUpdateForm(value: UserSubform) {
    setUserSubform(value);
    setForm({ ...form, '02-user': value });
  }

  const onSubmit = async () => {
    try {
      await UserApiClient.logIn({emailAddress: '', password: ''}, e => setError(e.))
    } catch (error) {
      
    }
    setError('sddddddddddddd');
    return;
    setForm({ ...form, step: Step.ContactMethods });
  };

  return (
    <>
      <div className={styles['create-user-page']}>
        <header className={styles.header}>
          <Typography
            className={styles.muted}
            variant='h6'
            align='center'
            component='h1'
          >
            Create QR codes
          </Typography>
          <Typography variant='h4' component='h2' align='center'>
            Who are you?
          </Typography>
        </header>
        <Paper>
          {/* <pre>{JSON.stringify(form, null, 4).replace(/["{[,\}\]]/g, '')}</pre> */}
          <Tabs
            value={userSubform.newOrExisting}
            onChange={(_, value) =>
              setSubformAndUpdateForm({ ...userSubform, newOrExisting: value })
            }
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            aria-label='full width tabs example'
          >
            <Tab label="I'm new" value={NewOrExisting.New} />
            <Tab label='I have an account' value={NewOrExisting.Existing} />
          </Tabs>

          <List>
            <ListItem>
              <TextField
                defaultValue={userSubform.emailAddress}
                label='Email Address'
                placeholder='Email Address'
                onChange={(e) =>
                  setSubformAndUpdateForm({
                    ...userSubform,
                    emailAddress: e.target.value,
                  })
                }
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Mail />
                    </InputAdornment>
                  ),
                }}
              />
            </ListItem>
            <ListItem>
              <TextField
                defaultValue={userSubform.password}
                label='Password'
                placeholder='Password'
                type='password'
                onChange={(e) =>
                  setSubformAndUpdateForm({
                    ...userSubform,
                    password: e.target.value,
                  })
                }
                fullWidth
                variant='outlined'
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />
            </ListItem>
            <ListItem>
              <Button
                fullWidth={true}
                variant='contained'
                color='secondary'
                onClick={(_) => onSubmit()}
              >
                {
                  {
                    [NewOrExisting.New]: 'Continue with email',
                    [NewOrExisting.Existing]: 'Sign up with email',
                  }[userSubform.newOrExisting]
                }
              </Button>
            </ListItem>
            {!!error ? (
              <ListItem>
                <Alert
                  style={{ width: '100%' }}
                  severity='error'
                  onClose={() => setError(null)}
                >
                  <Typography variant='body1'></Typography>
                  {error}
                </Alert>
              </ListItem>
            ) : null}
          </List>
        </Paper>
        <div className={styles['logo-footer']}>
          <LogoPortrait />
        </div>
      </div>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert
          elevation={6}
          variant='filled'
          severity='error'
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
