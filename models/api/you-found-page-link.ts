import { LinkType } from 'components/create-items/04-page-designers/page-designer/page-designer-subform';

interface BaseLink {
  label: string;
}
interface SMSLink extends BaseLink {
  type: LinkType.SMS;
  phoneNumber: string;
}
interface WhatsAppLink extends BaseLink {
  type: LinkType.WhatsApp;
  phoneNumber: string;
}
interface EmailLink extends BaseLink {
  type: LinkType.Email;
  emailAddress: string;
}

export type YouFoundPageLink = SMSLink | WhatsAppLink | EmailLink;
