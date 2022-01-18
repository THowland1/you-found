import connectDB from 'middleware/mongodb';
import { IMongooseDocument } from 'models/mongoose/IMongooseDocument';
import { Item } from 'models/schema/item';
import { Document } from 'mongoose';
import { z } from 'zod';

export async function getItemById(itemId: string) {
  await connectDB();
  z.string().parse(itemId);
  const item = await Item.findById(itemId).lean();

  if (item) {
    item.id = item._id?.toHexString();
    delete item._id;
  }
  return item;
}
