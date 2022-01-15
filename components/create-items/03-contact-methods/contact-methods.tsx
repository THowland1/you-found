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
  Paper
} from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import axios, { AxiosError } from 'axios';
import * as ApiModels from 'models/api';
import LogoPortrait from 'public/logo-landscape.svg';
import React, { useEffect, useState } from 'react';
import { useStateArray } from 'utils/hooks/use-state-array';
import { Step } from '../step';
import { SubformParams } from '../subform-params';
import { ContactMethodsApiClient } from './contact-methods-api-client';
import { MapContactMethods } from './contact-methods-mappings';
import {
  ContactMethodsSubform,
  EmailAddress,
  PhoneNumber
} from './contact-methods-subform';
import styles from './contact-methods.module.scss';

type Params = SubformParams;

export default function CreateItemsContactMethods({ form, setForm }: Params) {
  const [error, setError] = useState<any>(null);
  const [contactMethodsSubform, setContactMethodsSubform] = useState(
    form[Step.ContactMethods]
  );

  const userId = form[Step.User].userId;
  async function updateSubform() {
    const responseBody = await ContactMethodsApiClient.get({ userId });
    const newSubform = MapContactMethods.dtoToSubform(responseBody);
    setEmailAddresses(newSubform.emailAddresses);
    setPhoneNumbers(newSubform.phoneNumbers);
    setSubformAndUpdateForm(newSubform);
  }

  useEffect(() => {
    updateSubform();
  }, []);

  function setSubformAndUpdateForm(value: ContactMethodsSubform) {
    setContactMethodsSubform(value);
    setForm({ ...form, [Step.ContactMethods]: value });
  }

  const [
    emailAddresses,
    addEmailAddress,
    updateEmailAddress,
    removeEmailAddress,
    setEmailAddresses
  ] = useStateArray(contactMethodsSubform.emailAddresses, value =>
    setSubformAndUpdateForm({ ...contactMethodsSubform, emailAddresses: value })
  );
  const [
    phoneNumbers,
    addPhoneNumber,
    updatePhoneNumber,
    removePhoneNumber,
    setPhoneNumbers
  ] = useStateArray(contactMethodsSubform.phoneNumbers, value =>
    setSubformAndUpdateForm({ ...contactMethodsSubform, phoneNumbers: value })
  );

  const onSubmit = async () => {
    await saveContactMethods();
    setForm({ ...form, step: Step.PageDesigners });
  };

  async function saveContactMethods() {
    const subform = contactMethodsSubform;
    const newContactMethods = MapContactMethods.subformToDto(subform);
    await ContactMethodsApiClient.update({ userId }, newContactMethods);
  }

  return (
    <>
      <div className={styles['create-user-page']}>
        <header className={styles.header}>
          <Typography
            className={styles.muted}
            variant="h6"
            align="center"
            component="h1"
          >
            Create QR codes
          </Typography>
          <Typography variant="h4" component="h2" align="center">
            How can people get in touch with you?
          </Typography>
        </header>
        <Paper className={styles.content}>
          {/* <pre>{JSON.stringify(form, null, 4).replace(/["{[,\}\]]/g, '')}</pre> */}
          <List>
            <ListItem>
              <Typography variant="h6" component="h3">
                Your name
              </Typography>
            </ListItem>
            <ListItem>
              <TextField
                value={contactMethodsSubform.fullName}
                label="Your name"
                onChange={e =>
                  setSubformAndUpdateForm({
                    ...contactMethodsSubform,
                    fullName: e.target.value
                  })
                }
                fullWidth
                variant="outlined"
              />
            </ListItem>
            <ListItem>
              <Typography variant="h6" component="h3">
                Email addresses
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemText>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={form['02-user'].emailAddress}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </ListItemText>
            </ListItem>
            {contactMethodsSubform.emailAddresses.map((emailAddress, index) => (
              <ListItem dense key={emailAddress.emailAddressId}>
                <ListItemText>
                  <TextField
                    value={emailAddress.emailAddress}
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={e =>
                      updateEmailAddress(index, {
                        ...emailAddress,
                        emailAddress: e.target.value
                      })
                    }
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </ListItemText>
                <ListItemSecondaryAction
                  onClick={_ => removeEmailAddress(index)}
                >
                  <IconButton edge="end" aria-label="remove item">
                    <RemoveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}

            <ListItem>
              <Button
                fullWidth={true}
                color="secondary"
                onClick={_ => addEmailAddress(new EmailAddress())}
                startIcon={<AddIcon />}
              >
                Add email address
              </Button>
            </ListItem>

            <ListItem>
              <Typography variant="h6" component="h3">
                Phone numbers
              </Typography>
            </ListItem>

            {contactMethodsSubform.phoneNumbers.map((phoneNumber, index) => (
              <ListItem key={phoneNumber.phoneNumberId}>
                <ListItemText>
                  <TextField
                    value={phoneNumber.number}
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={e =>
                      updatePhoneNumber(index, {
                        ...phoneNumber,
                        number: e.target.value
                      })
                    }
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </ListItemText>
                <ListItemSecondaryAction
                  onClick={_ => removePhoneNumber(index)}
                >
                  <IconButton edge="end" aria-label="remove item">
                    <RemoveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}

            <ListItem>
              <Button
                fullWidth={true}
                color="secondary"
                onClick={_ => addPhoneNumber(new PhoneNumber())}
                startIcon={<AddIcon />}
              >
                Add phone number
              </Button>
            </ListItem>
          </List>

          <div className={styles.button}>
            <Button
              fullWidth={true}
              variant="contained"
              color="secondary"
              onClick={_ => onSubmit()}
            >
              Continue
            </Button>
          </div>
        </Paper>
        <div className={styles['logo-footer']}>
          <LogoPortrait />
        </div>
      </div>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
