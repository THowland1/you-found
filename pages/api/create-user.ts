import connectDB from 'middleware/mongodb';
import { NewUserRequest } from 'models/api/new-user-request';
import type { NextApiResponse } from 'next';
import { ApiRequest } from 'utils/api/api-request';
import { ValidationError } from 'utils/validation/validation-error';
import { post } from './create-user.post';

export default async (
  req: ApiRequest<NewUserRequest>,
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
