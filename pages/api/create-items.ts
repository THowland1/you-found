import connectDB from 'middleware/mongodb';
import { INewItemsRequest } from 'models/api/new-items-request';
import type { NextApiResponse } from 'next';
import { ApiPostRequest } from 'utils/api/api-request';
import { post } from './create-items.post';

export default async (
  req: ApiPostRequest<INewItemsRequest>,
  res: NextApiResponse
) => {
  try {
    await connectDB();
    switch (req.method) {
      case 'POST':
        await post(req, res);
        break;
      default:
        res.status(404);
        break;
    }
  } catch (e) {
    res.status(500);
  }
};
