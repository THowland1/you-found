import { getItemsByEmailAddress } from 'data-layer/getItemsByEmailAddress';
import connectDB from 'middleware/mongodb';
import { newItemSchema } from 'models/new-item';
import { IItem, Item } from 'models/schema/item';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case 'GET':
        const emailAddress = z.string().parse(req.query.emailAddress);
        console.log(emailAddress);
        const items = (await getItemsByEmailAddress(emailAddress)) as IItem[];
        res.status(200).json(items);
      case 'POST':
        const newItem = newItemSchema.parse(req.body);
        console.log(newItem);
        const newItemDocument = await Item.create(newItem);
        res.status(200).json({ itemId: newItemDocument._id!.toHexString() });
        break;
      default:
        res.status(404);
        break;
    }
  } catch (e) {
    res.status(500);
  }
};
