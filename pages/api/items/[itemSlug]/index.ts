import { deleteItemByItemSlug } from 'data-layer/deleteItemByItemSlug';
import { getItemById } from 'data-layer/getItemById';
import { getItemByItemSlug } from 'data-layer/getItemByItemSlug';
import { updateItemByItemSlug } from 'data-layer/updateItemByItemSlug';
import connectDB from 'middleware/mongodb';
import { newItemSchema } from 'models/new-item';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const itemSlug = z.string().parse(req.query.itemSlug);
    switch (req.method) {
      case 'GET':
        const item = await getItemByItemSlug(itemSlug);
        if (!item) {
          res.status(404);
        }
        res.status(200).json(item);
        break;
      case 'PUT':
        console.log(req.body);
        const { found: putFound } = await updateItemByItemSlug(
          itemSlug,
          req.body
        );
        if (putFound) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
        break;
      case 'DELETE':
        const { found: deleteFound } = await deleteItemByItemSlug(itemSlug);
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
