import { deleteItemById } from 'data-layer/deleteItemById';
import { getItemById } from 'data-layer/getItemById';
import { updateItemById } from 'data-layer/updateItemById';
import connectDB from 'middleware/mongodb';
import { newItemSchema } from 'models/new-item';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const itemId = z.string().parse(req.query.itemId);
    switch (req.method) {
      case 'GET':
        const item = await getItemById(itemId);
        if (!item) {
          res.status(404);
        }
        res.status(200).json(item);
        break;
      case 'PUT':
        console.log(req.body);
        const { found: putFound } = await updateItemById(itemId, req.body);
        if (putFound) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
        break;
      case 'DELETE':
        const { found: deleteFound } = await deleteItemById(itemId);
        if (deleteFound) {
          res.status(204).end();
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
