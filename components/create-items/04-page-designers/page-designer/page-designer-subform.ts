import { Link } from '@material-ui/core';
import {
  EmailAddress,
  PhoneNumber,
} from 'components/create-items/03-contact-methods/contact-methods-subform';
import { v4 } from 'uuid';

export enum LinkType {
  SMS = 'sms',
  WhatsApp = 'whatsapp',
  Email = 'email',
}

abstract class BaseLink<TLinkType extends LinkType> {
  abstract type: TLinkType;
  linkId = v4();
}

export class SMSLink extends BaseLink<LinkType.SMS> {
  type = LinkType.SMS as LinkType.SMS;
  phoneNumber: PhoneNumber | null = null;
  text = 'Reach out via text';
}

export class WhatsAppLink extends BaseLink<LinkType.WhatsApp> {
  type = LinkType.WhatsApp as LinkType.WhatsApp;
  phoneNumber: PhoneNumber | null = null;
  text = 'Reach out via WhatsApp';
}

export class EmailLink extends BaseLink<LinkType.Email> {
  type = LinkType.Email as LinkType.Email;
  emailAddress: EmailAddress | null = null;
  text = 'Reach out via email';
}

export type Link = SMSLink | WhatsAppLink | EmailLink;

export class PageDesignerSubform {
  message = '';
  links: Link[] = [];
}
