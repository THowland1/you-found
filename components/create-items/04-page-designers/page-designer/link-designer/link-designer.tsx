import {
  EmailAddress,
  PhoneNumber,
} from 'components/create-items/03-contact-methods/contact-methods-subform';
import React, { useState } from 'react';
import { v4 } from 'uuid';
import { Link, LinkType } from '../page-designer-subform';
import { EmailLinkDesigner } from './email-link-designer';
import { SmsLinkDesigner } from './sms-link-designer';
import { WhatsAppLinkDesigner } from './whatsapp-link-designer';

export function LinkDesigner({
  link,
  setLink,
  removeLink,
  phoneNumberOptions,
  emailAddressOptions,
}: {
  link: Link;
  setLink: React.Dispatch<typeof link>;
  removeLink: React.Dispatch<void>;
  phoneNumberOptions: PhoneNumber[];
  emailAddressOptions: EmailAddress[];
}) {
  const [labelId] = useState(v4());
  switch (link.type) {
    case LinkType.SMS:
      return (
        <SmsLinkDesigner
          link={link}
          setLink={setLink}
          removeLink={removeLink}
          phoneNumberOptions={phoneNumberOptions}
        />
      );
    case LinkType.WhatsApp:
      return (
        <WhatsAppLinkDesigner
          link={link}
          setLink={setLink}
          removeLink={removeLink}
          phoneNumberOptions={phoneNumberOptions}
        />
      );
    case LinkType.Email:
      return (
        <EmailLinkDesigner
          link={link}
          setLink={setLink}
          removeLink={removeLink}
          emailAddressOptions={emailAddressOptions}
        />
      );
    default:
      throw new TypeError('Not a configured link type');
  }
}
