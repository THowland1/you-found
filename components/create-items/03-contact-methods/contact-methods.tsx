import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import LogoPortrait from 'public/logo-landscape.svg';
import React, { useState } from 'react';
import { useStateArray } from 'utils/hooks/use-state-array';
import { Step } from '../step';
import { SubformParams } from '../subform-params';
import {
  ContactMethodsSubform,
  EmailAddress,
  PhoneNumber,
} from './contact-methods-subform';
import styles from './contact-methods.module.scss';

type Params = SubformParams;

export default function CreateItemsContactMethods({ form, setForm }: Params) {
  const [error, setError] = useState<any>(null);
  const [contactMethodsSubform, setContactMethodsSubform] = useState(
    form['03-contact-methods']
  );
  function setSubformAndUpdateForm(value: ContactMethodsSubform) {
    setContactMethodsSubform(value);
    setForm({ ...form, '03-contact-methods': value });
  }

  const [
    emailAddresses,
    addEmailAddress,
    updateEmailAddress,
    removeEmailAddress,
  ] = useStateArray(contactMethodsSubform.emailAddresses, (value) =>
    setSubformAndUpdateForm({ ...contactMethodsSubform, emailAddresses: value })
  );
  const [phoneNumbers, addPhoneNumber, updatePhoneNumber, removePhoneNumber] =
    useStateArray(contactMethodsSubform.phoneNumbers, (value) =>
      setSubformAndUpdateForm({ ...contactMethodsSubform, phoneNumbers: value })
    );

  const onSubmit = async () => {
    setForm({ ...form, step: Step.PageDesigners });
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
            How can people get in touch with you?
          </Typography>
        </header>
        <div className={styles.content}>
          {/* <pre>{JSON.stringify(form, null, 4).replace(/["{[,\}\]]/g, '')}</pre> */}
          <List>
            <ListItem>
              <Typography variant='h6' component='h3'>
                Your name
              </Typography>
            </ListItem>
            <ListItem>
              <TextField
                defaultValue={contactMethodsSubform.fullName}
                label='Your name'
                onChange={(e) =>
                  setSubformAndUpdateForm({
                    ...contactMethodsSubform,
                    fullName: e.target.value,
                  })
                }
                fullWidth
                variant='outlined'
              />
            </ListItem>
            <ListItem>
              <Typography variant='h6' component='h3'>
                Email addresses
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemText>
                <TextField
                  disabled
                  fullWidth
                  size='small'
                  variant='outlined'
                  value={form['02-user'].emailAddress}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </ListItemText>
            </ListItem>
            {contactMethodsSubform.emailAddresses.map((emailAddress, index) => (
              <ListItem dense>
                <ListItemText>
                  <TextField
                    defaultValue={emailAddress.emailAddress}
                    fullWidth
                    size='small'
                    variant='outlined'
                    onChange={(e) =>
                      updateEmailAddress(index, {
                        ...emailAddress,
                        emailAddress: e.target.value,
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </ListItemText>
                <ListItemSecondaryAction
                  onClick={(_) => removeEmailAddress(index)}
                >
                  <IconButton edge='end' aria-label='remove item'>
                    <RemoveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}

            <ListItem>
              <Button
                fullWidth={true}
                color='secondary'
                onClick={(_) => addEmailAddress(new EmailAddress())}
                startIcon={<AddIcon />}
              >
                Add email address
              </Button>
            </ListItem>

            <ListItem>
              <Typography variant='h6' component='h3'>
                Phone numbers
              </Typography>
            </ListItem>

            {contactMethodsSubform.phoneNumbers.map((phoneNumber, index) => (
              <ListItem>
                <ListItemText>
                  <TextField
                    defaultValue={phoneNumber.number}
                    fullWidth
                    size='small'
                    variant='outlined'
                    onChange={(e) =>
                      updatePhoneNumber(index, {
                        ...phoneNumber,
                        number: e.target.value,
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </ListItemText>
                <ListItemSecondaryAction
                  onClick={(_) => removePhoneNumber(index)}
                >
                  <IconButton edge='end' aria-label='remove item'>
                    <RemoveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}

            <ListItem>
              <Button
                fullWidth={true}
                color='secondary'
                onClick={(_) => addPhoneNumber(new PhoneNumber())}
                startIcon={<AddIcon />}
              >
                Add phone number
              </Button>
            </ListItem>
          </List>

          <div className={styles.button}>
            <Button
              fullWidth={true}
              variant='contained'
              color='secondary'
              onClick={(_) => onSubmit()}
            >
              Continue
            </Button>
          </div>
        </div>
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
