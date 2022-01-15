import mongoose, { Schema } from 'mongoose';
import { IMongooseDocument } from '../mongoose/IMongooseDocument';
import { IMongooseRef } from '../mongoose/IMongooseRef';
import { SchemaNames } from '../mongoose/schema-names';
import { IUserDocument } from './user';

export const itemValidation = {
  itemName: {
    minLength: 1,
    maxLength: 50
  }
};

export enum IItemPageLinkType {
  SMS = 'sms',
  WhatsApp = 'whatsapp',
  Email = 'email'
}

interface IBaseItemPageLink {
  linkId: string;
}

export interface IItemPageSMSLink extends IBaseItemPageLink {
  type: IItemPageLinkType.SMS;
  phoneNumberId: string;
  text: string;
}

export interface IItemPageWhatsAppLink extends IBaseItemPageLink {
  type: IItemPageLinkType.WhatsApp;
  phoneNumberId: string;
  text: string;
}

export interface IItemPageEmailLink extends IBaseItemPageLink {
  type: IItemPageLinkType.Email;
  emailAddressId: string;
  text: string;
}

export type IItemPageLink =
  | IItemPageSMSLink
  | IItemPageWhatsAppLink
  | IItemPageEmailLink;

export interface IItemPage {
  message: string;
  links: IItemPageLink[];
}

export interface IItem {
  emailAddress: string;
  headline: string;
  itemName: string;
  message: string;
  phoneNumber: string;
  showEmailLink: boolean;
  showPhoneCallLink: boolean;
  showSMSLink: boolean;
  showWhatsAppLink: boolean;
}

export const IUserProps: { [key in keyof IItem]: key } = {
  emailAddress: 'emailAddress',
  headline: 'headline',
  itemName: 'itemName',
  message: 'message',
  phoneNumber: 'phoneNumber',
  showEmailLink: 'showEmailLink',
  showPhoneCallLink: 'showPhoneCallLink',
  showSMSLink: 'showSMSLink',
  showWhatsAppLink: 'showWhatsAppLink'
};

export type IItemDocument = IMongooseDocument<IItem>;
export type IItemRef = IMongooseRef<IItemDocument>;

const ItemSchema: Schema = new Schema({
  emailAddress: { type: String, required: true },
  headline: { type: String, required: true },
  itemName: { type: String, required: true },
  message: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  showEmailLink: { type: Boolean, required: true },
  showPhoneCallLink: { type: Boolean, required: true },
  showSMSLink: { type: Boolean, required: true },
  showWhatsAppLink: { type: Boolean, required: true }
});

const getModel = () => {
  try {
    return mongoose.model<IItemDocument>(SchemaNames.ITEM);
  } catch (error) {
    return mongoose.model<IItemDocument>(SchemaNames.ITEM, ItemSchema);
  }
};

export const Item = getModel();
