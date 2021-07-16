import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { PhoneNumber } from 'components/create-items/03-contact-methods/contact-methods-subform';
import React, { useState } from 'react';
import { v4 } from 'uuid';
import { WhatsAppLink } from '../page-designer-subform';

export function WhatsAppLinkDesigner({
  link,
  setLink,
  removeLink,
  phoneNumberOptions,
}: {
  link: WhatsAppLink;
  setLink: React.Dispatch<WhatsAppLink>;
  removeLink: React.Dispatch<void>;
  phoneNumberOptions: PhoneNumber[];
}) {
  const [labelId] = useState(v4());

  function findPhoneNumberById(id: string) {
    return (
      phoneNumberOptions.find((option) => option.phoneNumberId === id) || null
    );
  }

  return (
    <List>
      <ListItem>
        <ListItemIcon style={{ minWidth: 0, marginRight: '.75em' }}>
          <FontAwesomeIcon icon={faWhatsapp} size='2x' />
        </ListItemIcon>
        <ListItemText>
          <Typography variant='h6'>WhatsApp link</Typography>
        </ListItemText>
        <ListItemSecondaryAction onClick={(_) => removeLink()}>
          <IconButton>
            <DeleteOutline />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText>
          <TextField
            defaultValue='Reach me via Whatsapp'
            label='Label'
            fullWidth
            variant='outlined'
            value={link.text}
            onChange={(e) => setLink({ ...link, text: e.target.value })}
          />
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          <FormControl variant='outlined' fullWidth>
            <InputLabel id={labelId}>Number</InputLabel>
            <Select
              label='Number'
              variant='outlined'
              labelId={labelId}
              value={link.phoneNumber?.phoneNumberId}
              onChange={(e) => {
                const phoneNumber = setLink({
                  ...link,
                  phoneNumber: findPhoneNumberById(e.target.value as string),
                });
              }}
            >
              {phoneNumberOptions.map((option) => (
                <MenuItem value={option.phoneNumberId}>
                  {option.number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItemText>
      </ListItem>
    </List>
  );
}
