import connectDB from 'middleware/mongodb';
import { Item } from 'models/schema/item';
import { z } from 'zod';

export async function getItemById(itemId: string) {
  await connectDB();
  z.string().parse(itemId);
  const item = await Item.findById(itemId).lean();
  if (item) {
    delete item._id;
  }
  return item;
}
