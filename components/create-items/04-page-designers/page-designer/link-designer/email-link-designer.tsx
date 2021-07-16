import {
  faComment,
  faComments,
  faEnvelope,
} from '@fortawesome/free-regular-svg-icons';
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
import {
  Delete,
  DeleteOutline,
  Email,
  RemoveCircleOutline,
} from '@material-ui/icons';
import { EmailAddress } from 'components/create-items/03-contact-methods/contact-methods-subform';
import React, { useState } from 'react';
import { v4 } from 'uuid';
import { EmailLink } from '../page-designer-subform';

export function EmailLinkDesigner({
  link,
  setLink,
  removeLink,
  emailAddressOptions,
}: {
  link: EmailLink;
  setLink: React.Dispatch<EmailLink>;
  removeLink: React.Dispatch<void>;
  emailAddressOptions: EmailAddress[];
}) {
  const [labelId] = useState(v4());

  function findEmailAddressById(id: string) {
    return (
      emailAddressOptions.find((option) => option.emailAddressId === id) || null
    );
  }

  return (
    <List>
      <ListItem>
        <ListItemIcon style={{ minWidth: 0, marginRight: '.75em' }}>
          <FontAwesomeIcon icon={faEnvelope} size='2x' />
        </ListItemIcon>
        <ListItemText>
          <Typography variant='h6'>Email link</Typography>
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
            defaultValue='Reach me via Email'
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
            <InputLabel id={labelId}>Email address</InputLabel>
            <Select
              label='Number'
              variant='outlined'
              labelId={labelId}
              value={link.emailAddress?.emailAddressId}
              onChange={(e) => {
                setLink({
                  ...link,
                  emailAddress: findEmailAddressById(e.target.value as string),
                });
              }}
            >
              {emailAddressOptions.map((option) => (
                <MenuItem value={option.emailAddressId}>
                  {option.emailAddress}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItemText>
      </ListItem>
    </List>
  );
}
