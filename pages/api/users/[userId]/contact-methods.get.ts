import * as ApiModels from 'models/api';
import { User } from 'models/schema/user';
import type { NextApiResponse } from 'next';
import { ApiGetRequest } from 'utils/api/api-request';
import { ValidationError } from 'utils/validation/validation-error';
import { ValidationErrorCode } from 'utils/validation/validation-error-code';
import * as Maps from './contact-methods-mapping';

type IRouteParams = ApiModels.ContactMethods.IRouteParams;
type IResponse = ApiModels.ContactMethods.Get.IResponse;

export async function get(
  req: ApiGetRequest<IRouteParams>,
  res: NextApiResponse<IResponse>
) {
  try {
    const userId = req.query.userId;
    const userDocument = await User.findById(userId);
    if (!userDocument) throw getNotFoundError(userId);

    res.status(200).json(Maps.MapContactMethods.entityToDto(userDocument));
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json(e as unknown as any);
    } else {
      res.status(500);
    }
  } finally {
    res.end();
  }
}

function getNotFoundError(userId: string) {
  return new ValidationError(
    ValidationErrorCode.GetUserContactDetails_User_NotFound,
    userId
  );
}
