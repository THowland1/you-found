import { getItemById } from 'data-layer/getItemById';
import connectDB from 'middleware/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

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
