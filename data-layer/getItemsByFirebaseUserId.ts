import connectDB from 'middleware/mongodb';
import { Item } from 'models/schema/item';
import { z } from 'zod';

export async function getItemsByFirebaseUserId(firebaseUserId: string) {
  await connectDB();
  z.string().parse(firebaseUserId);
  const items = await Item.find({ firebaseUserId }).lean();
  items.forEach(item => {
    item.id = item._id?.toHexString();
    delete item._id;
  });
  return items;
}
