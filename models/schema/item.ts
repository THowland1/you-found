import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import { IMongooseDocument } from '../mongoose/IMongooseDocument';
import { IMongooseRef } from '../mongoose/IMongooseRef';
import { SchemaNames } from '../mongoose/schema-names';

const dateSchema = z.preprocess(arg => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

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

export const IItemEventSchema = z.discriminatedUnion('eventType', [
  z.object({
    eventType: z.literal('Visited'),
    datetime: z.date()
  }),
  z.object({
    eventType: z.literal('MessageSent'),
    datetime: dateSchema,
    messageSentProps: z.object({
      message: z.string()
    })
  })
]);

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
  ),
  events: z.array(IItemEventSchema)
});
export type IItem = z.infer<typeof IItemSchema>;
export type IItemDocument = IMongooseDocument<IItem>;
export type IItemRef = IMongooseRef<IItemDocument>;
export type IItemEvent = z.infer<typeof IItemEventSchema>;

const ItemSchema: Schema = new Schema({
  itemId: { type: Number, required: true },
  itemSlug: { type: String, required: true },
  firebaseUserId: { type: String, required: true },
  headline: { type: String, required: true },
  itemName: { type: String, required: true },
  message: { type: String, required: true },
  events: [
    {
      eventType: {
        type: String,
        required: true,
        enum: ['Visited', 'MessageSent']
      },
      datetime: { type: Date, required: true },
      messageSentProps: {
        type: {
          message: {
            type: String,
            required: true
          }
        }
      }
    }
  ],
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
export type IItemPageLink = any;
export type IItemPageLinkType = any;
