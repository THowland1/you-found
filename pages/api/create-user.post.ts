import { NewUserRequest } from 'models/api/new-user-request';
import { IUser, User } from 'models/schema/user';
import { Types } from 'mongoose';
import type { NextApiResponse } from 'next';
import { ApiRequest } from 'utils/api/api-request';
import { ValidationError } from 'utils/validation/validation-error';
import { validate } from './create-user.post.validate';

export async function post(
  req: ApiRequest<NewUserRequest>,
  res: NextApiResponse
) {
  try {
    await validate(req);
    const newUser: IUser = {
      userHandle: req.body.userEmailAddress,
      userEmailAddresses: [
        {
          emailAddressId: new Types.ObjectId(),
          emailAddress: req.body.userEmailAddress,
        },
      ],
      userFullName: req.body.userEmailAddress,
      userPhoneNumbers: [],
      items: [],
    };
    await User.create(newUser);
    res.status(200).json({ message: 'Ayyy', body: req.body });
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json(e);
    } else {
      res.status(500);
    }
  } finally {
    res.end();
  }
}
