import { addItemEventByItemSlug } from 'data-layer/addItemEventByItemSlug';
import connectDB from 'middleware/mongodb';
import { IItemEventSchema } from 'models/schema/item';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const itemSlug = z.string().parse(req.query.itemSlug);
    const itemEvent = IItemEventSchema.parse(req.body);

    switch (req.method) {
      case 'POST':
        const item = await addItemEventByItemSlug(itemSlug, itemEvent);
        if (item.found) {
          res.status(200).json(item);
        } else {
          res.status(404).end();
        }
        break;
      default:
        res.status(404).end();
        break;
    }
  } catch (e) {
    res.status(500).end();
  }
};
