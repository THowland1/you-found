import connectDB from 'middleware/mongodb';
import { IItemSchema, Item } from 'models/schema/item';
import { z } from 'zod';

export async function getItemById(itemId: string) {
  await connectDB();
  z.string().parse(itemId);
  const item = await Item.findById(itemId).lean();

  const parsedItem = IItemSchema.parse(item);

  return parsedItem;
}
