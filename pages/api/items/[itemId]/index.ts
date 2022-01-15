import connectDB from 'middleware/mongodb';
import { Item } from 'models/schema/item';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { schema } from '../../../_/new';

export async function getItemById(itemId: string) {
  await connectDB();
  z.string().parse(itemId);
  const item = await Item.findById(itemId).lean();
  if (item) {
    delete item._id;
  }
  return item;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case 'GET':
        const itemId = z.string().parse(req.query.itemId);
        const item = await getItemById(itemId);
        if (!item) {
          res.status(404);
        }
        res.status(200).json(item);
        break;
      default:
        res.status(404);
        break;
    }
  } catch (e) {
    res.status(500);
  }
};
