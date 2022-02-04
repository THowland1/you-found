import connectDB from 'middleware/mongodb';
import { Item } from 'models/schema/item';
import { z } from 'zod';

export async function deleteItemByItemSlug(itemSlug: string) {
  await connectDB();
  z.string().parse(itemSlug);
  const item = await Item.findOneAndDelete({ itemSlug });
  if (item) {
    return { found: true };
  } else {
    return { found: false };
  }
}
