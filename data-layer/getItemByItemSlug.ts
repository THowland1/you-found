import connectDB from 'middleware/mongodb';
import { IItemSchema, Item } from 'models/schema/item';
import { z } from 'zod';

export async function getItemByItemSlug(itemSlug: string) {
  await connectDB();
  z.string().parse(itemSlug);
  const item = await Item.findOne({ itemSlug }).lean();

  const parsedItem = IItemSchema.parse(item);

  return parsedItem;
}
