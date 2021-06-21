import mongoose, { Schema } from 'mongoose';
import { IMongooseDocument } from '../mongoose/IMongooseDocument';
import { IMongooseRef } from '../mongoose/IMongooseRef';
import { SchemaNames } from '../mongoose/schema-names';

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

export interface IUser {
  userHandle: string;
  userEmailAddress: string;
  userFullName: string;
  userPhoneNumber: string | null;
  userItems: IUserItem[];
}

export const IUserProps: { [key in keyof IUser]: key } = {
  userHandle: 'userHandle',
  userEmailAddress: 'userEmailAddress',
  userFullName: 'userFullName',
  userPhoneNumber: 'userPhoneNumber',
  userItems: 'userItems',
};

export type IUserDocument = IMongooseDocument<IUser>;
export type IUserRef = IMongooseRef<IUserDocument>;

const UserSchema: Schema = new Schema({
  userHandle: { type: String, required: true },
  userEmailAddress: { type: String, required: true },
  userFullName: { type: String, required: true },
  userPhoneNumber: { type: String },
  userItems: [
    {
      itemName: { type: String, required: true },
      itemHandle: { type: String, required: true },
    },
  ],
});

const getModel = () => {
  try {
    return mongoose.model<IUserDocument>(SchemaNames.USER);
  } catch (error) {
    return mongoose.model<IUserDocument>(SchemaNames.USER, UserSchema);
  }
};

export const User = getModel();
