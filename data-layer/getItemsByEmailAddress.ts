import connectDB from 'middleware/mongodb';
import { Item } from 'models/schema/item';
import { caseInsensitive } from 'utils/mongodb/case-insensitive';
import { z } from 'zod';

export async function getItemsByEmailAddress(emailAddress: string) {
  await connectDB();
  z.string().parse(emailAddress);
  const items = await Item.find({
    emailAddress: caseInsensitive(emailAddress)
  }).lean();
  items.forEach(item => {
    item.id = item._id?.toHexString();
    delete item._id;
  });
  return items;
}
