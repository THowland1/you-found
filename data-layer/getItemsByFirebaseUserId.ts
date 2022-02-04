import connectDB from 'middleware/mongodb';
import { IItemSchema, Item } from 'models/schema/item';
import { z } from 'zod';

export async function getItemsByFirebaseUserId(firebaseUserId: string) {
  await connectDB();
  z.string().parse(firebaseUserId);
  const items = await Item.find({ firebaseUserId }).lean();
  const parsedItems = items.map(item => {
    return IItemSchema.parse(item);
  });
  return parsedItems;
}
