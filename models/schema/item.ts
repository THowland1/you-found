import mongoose, { Schema } from 'mongoose';
import { IMongooseDocument } from '../mongoose/IMongooseDocument';
import { IMongooseRef } from '../mongoose/IMongooseRef';
import { SchemaNames } from '../mongoose/schema-names';
import { IUserDocument } from './user';

export const itemValidation = {
  itemName: {
    minLength: 1,
    maxLength: 50,
  },
};

export enum IItemPageLinkType {
  SMS = 'sms',
  WhatsApp = 'whatsapp',
  Email = 'email',
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
  user: IMongooseRef<IUserDocument>;
  itemName: string;
  itemPage: IItemPage;
}

export const IUserProps: { [key in keyof IItem]: key } = {
  user: 'user',
  itemName: 'itemName',
  itemPage: 'itemPage',
};

export type IItemDocument = IMongooseDocument<IItem>;
export type IItemRef = IMongooseRef<IItemDocument>;

const ItemPageSchema = new Schema({
  message: { type: String, required: true },
  links: [
    {
      linkId: { type: String, required: true },
      type: { type: String, required: true },
      phoneNumberId: String,
      emailAddressId: String,
    },
  ],
});

const ItemSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: SchemaNames.USER },
  itemName: { type: String, required: true },
  itemPage: ItemPageSchema,
});

const getModel = () => {
  try {
    return mongoose.model<IItemDocument>(SchemaNames.ITEM);
  } catch (error) {
    return mongoose.model<IItemDocument>(SchemaNames.ITEM, ItemSchema);
  }
};

export const Item = getModel();
