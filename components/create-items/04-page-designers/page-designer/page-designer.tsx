import {
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Item } from 'components/create-items/01-names/names-subform';
import { Form } from 'components/create-items/form';
import { Step } from 'components/create-items/step';
import React, { useState } from 'react';
import { useStateArray } from 'utils/hooks/use-state-array';
import { LinkDesigner } from './link-designer/link-designer';
import { PageDesignerPreview } from './page-designer-preview';
import {
  EmailLink,
  Link,
  PageDesignerSubform,
  SMSLink,
  WhatsAppLink,
} from './page-designer-subform';
import { isLinkValid } from './page-designer-subform-transforms';

type Params = {
  form: Form;
  page: PageDesignerSubform;
  setPage: React.Dispatch<PageDesignerSubform>;
  onSubmit: (subsubform: PageDesignerSubform) => void;
  item: Item;
};

function linksAreValid(link: Link[]) {
  return link.every(isLinkValid);
}

export default function PageDesigner({
  form,
  page,
  setPage,
  onSubmit,
  item,
}: Params) {
  const [error, setError] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [links, addLink, updateLink, removeLink] = useStateArray(
    page.links,
    (value) => setPage({ ...page, links: value })
  );

  const userFullName = form[Step.ContactMethods].fullName;
  const phoneNumberOptions = form['03-contact-methods'].phoneNumbers;
  const emailAddressOptions = form['03-contact-methods'].emailAddresses;

  const linksValid = linksAreValid(links);

  function showPreview() {
    alert('woo');
  }

  return (
    <>
      <List>
        <ListItem>
          <Typography variant='h6' component='h3'>
            Message
          </Typography>
        </ListItem>
        <ListItem>
          <TextField
            defaultValue={page.message}
            label='Message'
            onChange={(e) =>
              setPage({
                ...page,
                message: e.target.value,
              })
            }
            fullWidth
            variant='outlined'
          />
        </ListItem>
        <ListItem>
          <Typography variant='h6' component='h3'>
            Links
          </Typography>
        </ListItem>
        {page.links.map((link, index) => (
          <ListItem>
            <ListItemText>
              <Paper>
                <LinkDesigner
                  link={link}
                  setLink={(newLink) => updateLink(index, newLink)}
                  removeLink={(_) => removeLink(index)}
                  phoneNumberOptions={phoneNumberOptions}
                  emailAddressOptions={emailAddressOptions}
                />
              </Paper>
            </ListItemText>
          </ListItem>
        ))}
        <ListItem>
          {[
            { text: 'Add SMS link', constructor: SMSLink },
            { text: 'Add WhatsApp link', constructor: WhatsAppLink },
            { text: 'Add Email link', constructor: EmailLink },
          ].map((btn) => (
            <Button
              fullWidth={true}
              color='secondary'
              onClick={(_) => addLink(new btn.constructor())}
              startIcon={<AddIcon />}
            >
              {btn.text}
            </Button>
          ))}
        </ListItem>
        <ListItem>
          <Button
            disabled={!linksValid}
            fullWidth={true}
            variant='outlined'
            color='secondary'
            onClick={(_) => setPreviewOpen(true)}
          >
            Show preview
          </Button>
        </ListItem>
        <ListItem>
          <Button
            fullWidth={true}
            variant='contained'
            color='secondary'
            onClick={(_) => onSubmit(page)}
          >
            Continue
          </Button>
        </ListItem>
      </List>
      {linksValid ? (
        <PageDesignerPreview
          open={previewOpen}
          handleClose={() => setPreviewOpen(false)}
          itemName={item.name}
          links={page.links}
          message={page.message}
          userFullName={userFullName}
        />
      ) : null}
    </>
  );
}
