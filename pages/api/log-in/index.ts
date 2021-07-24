import connectDB from 'middleware/mongodb';
import type { NextApiResponse } from 'next';
import { ApiPostRequest } from 'utils/api/api-request';
import { post } from './index.post';
import * as ApiModels from 'models/api';

export const LOG_IN_PATH = '/api/log-in';

export default async (
  req: ApiPostRequest<ApiModels.LogIn.IRequest>,
  res: NextApiResponse<ApiModels.LogIn.IResponse>
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
