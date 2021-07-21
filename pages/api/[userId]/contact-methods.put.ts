import { Api } from 'models/api';
import { IUserEmailAddress, IUserPhoneNumber, User } from 'models/schema/user';
import { Types } from 'mongoose';
import type { NextApiResponse } from 'next';
import { ApiPutRequest } from 'utils/api/api-request';
import { ValidationError } from 'utils/validation/validation-error';
import { ValidationErrorCode } from 'utils/validation/validation-error-code';
import {
  MapContactMethods,
  MapEmailAddress,
  MapPhoneNumber,
} from './contact-methods-mapping';
import { validate } from './contact-methods.put.validate';

type IRouteParams = Api.ContactMethods.IRouteParams;
type IRequest = Api.ContactMethods.Update.IRequest;

export async function put(
  req: ApiPutRequest<IRequest, IRouteParams>,
  res: NextApiResponse
) {
  try {
    await validate(req);
    const userId = req.query.userId;
    const userDocument = await User.findById(userId);
    if (!userDocument) throw getNotFoundError(userId);

    const userDocumentUpdates = MapContactMethods.dtoToPartialEntity(req.body);
    await userDocument.update(userDocumentUpdates);

    res.status(200).json({});
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

function getNotFoundError(userId: string) {
  return new ValidationError(
    ValidationErrorCode.UpdateUserContactDetails_User_NotFound,
    userId
  );
}
