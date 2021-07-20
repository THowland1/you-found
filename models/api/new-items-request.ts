import { Types } from 'mongoose';

export enum INewItemsRequestItemPageLinkType {
  SMS = 'sms',
  WhatsApp = 'whatsapp',
  Email = 'email',
}

interface IBaseItemPageLink {
  linkId: string;
}

export interface INewItemsRequestItemPageSMSLink extends IBaseItemPageLink {
  type: INewItemsRequestItemPageLinkType.SMS;
  phoneNumberId: string;
  text: string;
}

export interface INewItemsRequestItemPageWhatsAppLink
  extends IBaseItemPageLink {
  type: INewItemsRequestItemPageLinkType.WhatsApp;
  phoneNumberId: string;
  text: string;
}

export interface INewItemsRequestItemPageEmailLink extends IBaseItemPageLink {
  type: INewItemsRequestItemPageLinkType.Email;
  emailAddressId: string;
  text: string;
}

export type INewItemsRequestItemPageLink =
  | INewItemsRequestItemPageSMSLink
  | INewItemsRequestItemPageWhatsAppLink
  | INewItemsRequestItemPageEmailLink;

export interface INewItemsRequestItemPage {
  message: string;
  links: INewItemsRequestItemPageLink[];
}

export interface INewItemsRequestItem {
  itemName: string;
  itemPage: INewItemsRequestItemPage;
}

export interface INewItemsRequest {
  userId: string;
  items: INewItemsRequestItem[];
}
