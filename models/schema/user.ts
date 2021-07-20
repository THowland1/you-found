import mongoose, { Schema, Types } from 'mongoose';
import { IMongooseDocument } from '../mongoose/IMongooseDocument';
import { IMongooseRef } from '../mongoose/IMongooseRef';
import { SchemaNames } from '../mongoose/schema-names';
import { IItem, IItemDocument } from './item';

export const userValidation = {
  userFullName: {
    minLength: 1,
    maxLength: 50,
  },
  userHandle: {
    minLength: 2,
    maxLength: 20,
  },
};

export interface IUserItem {
  itemName: string;
  itemHandle: string;
}

export interface IUserPhoneNumber {
  phoneNumberId: Types.ObjectId;
  phoneNumber: string;
}

export interface IUserEmailAddress {
  emailAddressId: Types.ObjectId;
  emailAddress: string;
}

export interface IUser {
  userHandle: string;
  userEmailAddresses: IUserEmailAddress[];
  userFullName: string;
  userPhoneNumbers: IUserPhoneNumber[];
  items: IMongooseRef<IItemDocument>[];
}

export const IUserProps: { [key in keyof IUser]: key } = {
  userHandle: 'userHandle',
  userEmailAddresses: 'userEmailAddresses',
  userFullName: 'userFullName',
  userPhoneNumbers: 'userPhoneNumbers',
  items: 'items',
};

export type IUserDocument = IMongooseDocument<IUser>;
export type IUserRef = IMongooseRef<IUserDocument>;

const UserSchema: Schema = new Schema({
  userHandle: { type: String, required: true },
  userEmailAddresses: [
    {
      emailAddressId: { type: String, required: true },
      emailAddress: { type: String, required: true },
    },
  ],
  userFullName: { type: String, required: true },
  userPhoneNumbers: [
    {
      phoneNumberId: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
  ],
  items: [{ type: Schema.Types.ObjectId, ref: SchemaNames.ITEM }],
});

const getModel = () => {
  try {
    return mongoose.model<IUserDocument>(SchemaNames.USER);
  } catch (error) {
    return mongoose.model<IUserDocument>(SchemaNames.USER, UserSchema);
  }
};

export const User = getModel();
