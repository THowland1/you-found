import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import LogoPortrait from 'public/logo-landscape.svg';
import React, { useState } from 'react';
import { useStateArray } from 'utils/hooks/use-state-array';
import { Step } from '../step';
import { SubformParams } from '../subform-params';
import { Item, NamesSubform } from './names-subform';
import styles from './names.module.scss';

type Params = SubformParams;

export default function CreateItemsNames({ form, setForm }: Params) {
  const [error, setError] = useState<any>(null);
  const [namesSubform, setNamesSubform] = useState(form['01-names']);
  function setSubformAndUpdateForm(value: NamesSubform) {
    setNamesSubform(value);
    setForm({ ...form, '01-names': value });
  }

  const [items, addItem, updateItem, removeItem] = useStateArray(
    form['01-names'].items,
    value => setSubformAndUpdateForm({ ...namesSubform, items: value })
  );

  const submitItems = async () => {
    setForm({ ...form, step: Step.User });
  };
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
            What items do you want codes for?
          </Typography>
        </header>
        <div className={styles.content}>
          {/* <pre>{JSON.stringify(form, null, 4).replace(/["{[,\}\]]/g, '')}</pre> */}
          <List>
            {items.map((item, index) => (
              <ListItem key={item.id} role={undefined}>
                <ListItemText>
                  <TextField
                    defaultValue={item.name}
                    label={`Item ${index + 1}`}
                    fullWidth
                    variant="outlined"
                    placeholder={item.placeholder}
                    onChange={e =>
                      updateItem(index, { ...item, name: e.target.value })
                    }
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </ListItemText>
                <ListItemSecondaryAction onClick={_ => removeItem(index)}>
                  {index > 0 ? (
                    <IconButton edge="end" aria-label="remove item">
                      <RemoveIcon />
                    </IconButton>
                  ) : null}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <ListItem key={200} role={undefined}>
              <ListItemText></ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  onClick={_ => addItem(new Item())}
                  edge="end"
                  aria-label="add item"
                >
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <div className={styles.button}>
            <Button variant="contained" color="secondary" onClick={submitItems}>
              Continue
            </Button>
          </div>
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
