import { faComment, faComments } from '@fortawesome/free-regular-svg-icons';
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
import { DeleteOutline, Email, Sms } from '@material-ui/icons';
import { PhoneNumber } from 'components/create-items/03-contact-methods/contact-methods-subform';
import { Form } from 'components/create-items/form';
import React, { useState } from 'react';
import { v4 } from 'uuid';
import { PageDesignerSubform, SMSLink } from '../page-designer-subform';

export function SmsLinkDesigner({
  link,
  setLink,
  removeLink,
  phoneNumberOptions,
}: {
  link: SMSLink;
  setLink: React.Dispatch<SMSLink>;
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
          <FontAwesomeIcon icon={faComments} size='2x' />
        </ListItemIcon>
        <ListItemText>
          <Typography variant='h6'>SMS link</Typography>
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
            defaultValue='Reach me via Text'
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
