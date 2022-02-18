import connectDB from 'middleware/mongodb';
import { IItem, IItemSchema, Item } from 'models/schema/item';
import { z } from 'zod';

export async function updateItemByItemSlug(itemSlug: string, newItem: IItem) {
  await connectDB();

  z.string().parse(itemSlug);
  const newValue = IItemSchema.parse(newItem);

  const item = await Item.findOneAndUpdate({ itemSlug }, newValue, {
    new: true
  });
  if (item) {
    return { found: true, item: IItemSchema.parse(item) } as const;
  } else {
    return { found: false } as const;
  }
}
