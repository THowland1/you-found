import connectDB from 'middleware/mongodb';
import { newItemSchema } from 'models/new-item';
import { IItem, Item } from 'models/schema/item';
import { z } from 'zod';

export async function updateItemById(itemId: string, newItem: IItem) {
  await connectDB();

  z.string().parse(itemId);
  const newValue = newItemSchema.parse(newItem);

  const item = await Item.findByIdAndUpdate(itemId, newValue);
  if (item) {
    return { found: true };
  } else {
    return { found: false };
  }
}
