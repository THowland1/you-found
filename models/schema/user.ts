import mongoose, { Schema } from 'mongoose';
import { IMongooseDocument } from '../IMongooseDocument';
import { IMongooseRef } from '../IMongooseRef';
import { SchemaNames } from '../schema-names';

export interface IUserItem {
  itemName: string;
  itemHandle: string;
}

export interface IUser {
  userHandle: string;
  userEmailAddress: string;
  userFullName: string;
  userPhoneNumber: string;
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
  userPhoneNumber: { type: String, required: true },
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
