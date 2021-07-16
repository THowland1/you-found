import { Dialog, DialogContent, Modal } from '@material-ui/core';
import {
  EmailAddress,
  PhoneNumber,
} from 'components/create-items/03-contact-methods/contact-methods-subform';
import { IPhoneX } from 'components/devices/iphone-x';
import YouFoundPage from 'components/you-found-page/you-found-page';
import { YouFoundPageLink } from 'models/api/you-found-page-link';
import React from 'react';
import { Link, LinkType, PageDesignerSubform } from './page-designer-subform';

interface Props {
  open: boolean;
  handleClose: () => void;
  message: string;
  links: Link[];
  itemName: string;
  userFullName: string;
}

function mapLinkToLink(link: Link): YouFoundPageLink {
  switch (link.type) {
    case LinkType.SMS:
      return {
        type: LinkType.SMS,
        label: link.text,
        phoneNumber: link.phoneNumber!.number,
      };
    case LinkType.WhatsApp:
      return {
        type: LinkType.WhatsApp,
        label: link.text,
        phoneNumber: link.phoneNumber!.number,
      };
    case LinkType.Email:
      return {
        type: LinkType.Email,
        label: link.text,
        emailAddress: link.emailAddress!.emailAddress,
      };
  }
}

export function PageDesignerPreview({
  open,
  handleClose,
  message,
  links,
  itemName,
  userFullName,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IPhoneX
        contents={
          <div style={{ height: '100%', backgroundColor: 'white' }}>
            <YouFoundPage
              itemName={itemName}
              userFullName={userFullName}
              message={message}
              links={links.map(mapLinkToLink)}
            />
          </div>
        }
      />
      {/* <DialogContent>Foo</DialogContent> */}
    </Modal>
  );
}
