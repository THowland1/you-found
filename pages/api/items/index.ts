import connectDB from 'middleware/mongodb';
import { Item } from 'models/schema/item';
import { NextApiRequest, NextApiResponse } from 'next';
import { schema } from '../../_/new';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case 'POST':
        const newItem = schema.parse(req.body);
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
