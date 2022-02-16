import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import { IMongooseDocument } from '../mongoose/IMongooseDocument';
import { IMongooseRef } from '../mongoose/IMongooseRef';
import { SchemaNames } from '../mongoose/schema-names';

const IItemLinkSchema = z.object({
  showButton: z.boolean(),
  buttonText: z.string()
});
const IItemLinkWhatsappLinkSchema = IItemLinkSchema.extend({
  linkType: z.literal('whatsapp'),
  phoneNumber: z.string()
});
const IItemLinkEmailLinkSchema = IItemLinkSchema.extend({
  linkType: z.literal('email'),
  emailAddress: z.string()
});
const IItemLinkCallLinkSchema = IItemLinkSchema.extend({
  linkType: z.literal('call'),
  phoneNumber: z.string()
});
const IItemLinkSmsLinkSchema = IItemLinkSchema.extend({
  linkType: z.literal('sms'),
  phoneNumber: z.string()
});

export const IItemSchema = z.object({
  itemId: z.number(),
  itemSlug: z.string(),
  firebaseUserId: z.string(),
  headline: z.string(),
  itemName: z.string(),
  message: z.string(),
  links: z.array(
    z.union([
      IItemLinkWhatsappLinkSchema,
      IItemLinkEmailLinkSchema,
      IItemLinkCallLinkSchema,
      IItemLinkSmsLinkSchema
    ])
  )
});
export type IItem = z.infer<typeof IItemSchema>;
export type IItemDocument = IMongooseDocument<IItem>;
export type IItemRef = IMongooseRef<IItemDocument>;

const ItemSchema: Schema = new Schema({
  itemId: { type: Number, required: true },
  itemSlug: { type: String, required: true },
  firebaseUserId: { type: String, required: true },
  headline: { type: String, required: true },
  itemName: { type: String, required: true },
  message: { type: String, required: true },

  links: [
    {
      linkType: {
        type: String,
        required: true,
        enum: ['whatsapp', 'email', 'call', 'sms']
      },
      showButton: {
        type: Boolean,
        required: true
      },
      buttonText: {
        type: String,
        required: true
      },
      phoneNumber: {
        type: String,
        required: function () {
          const self = this as any;
          return ['whatsapp', 'call', 'sms'].includes(self.linkType);
        }
      },
      emailAddress: {
        type: String,
        required: function () {
          const self = this as any;
          return ['email'].includes(self.linkType);
        }
      }
    }
  ]
});

const getModel = () => {
  try {
    return mongoose.model<IItemDocument>(SchemaNames.ITEM);
  } catch (error) {
    return mongoose.model<IItemDocument>(SchemaNames.ITEM, ItemSchema);
  }
};

export const Item = getModel();

export type IItemPage = any;
