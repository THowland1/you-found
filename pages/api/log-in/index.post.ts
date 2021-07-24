import type { NextApiResponse } from 'next';
import { ApiPostRequest } from 'utils/api/api-request';
import { ValidationError } from 'utils/validation/validation-error';
import { validate } from './index.post.validate';
import * as ApiModels from 'models/api';
import { ValidationErrorCode } from 'utils/validation/validation-error-code';

export async function post(
  req: ApiPostRequest<ApiModels.LogIn.IRequest>,
  res: NextApiResponse<ApiModels.LogIn.IResponse>
) {
  try {
    await validate(req);
    throw new ValidationError(
      ValidationErrorCode.UpdateUserContactDetails_User_NotFound,
      '3333334'
    );
    res.status(200).json({ userId: '', userJwt: '' });
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
