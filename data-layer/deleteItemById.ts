import connectDB from 'middleware/mongodb';
import { Item } from 'models/schema/item';
import { z } from 'zod';

export async function deleteItemById(itemId: string) {
  await connectDB();
  z.string().parse(itemId);
  const item = await Item.findByIdAndDelete(itemId);
  if (item) {
    return { found: true };
  } else {
    return { found: false };
  }
}
