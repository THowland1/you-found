import connectDB from 'middleware/mongodb';
import { newItemSchema } from 'models/new-item';
import { IItem, Item } from 'models/schema/item';
import { z } from 'zod';

export async function updateItemByItemSlug(itemSlug: string, newItem: IItem) {
  await connectDB();

  z.string().parse(itemSlug);
  const newValue = newItemSchema.parse(newItem);

  const item = await Item.findOneAndUpdate({ itemSlug }, newValue);
  if (item) {
    return { found: true };
  } else {
    return { found: false };
  }
}
