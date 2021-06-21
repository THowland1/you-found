import { NewUserRequest } from 'models/api/new-user-request';
import { User, userValidation } from 'models/schema/user';
import type { NextApiResponse } from 'next';
import { ApiRequest } from 'utils/api/api-request';
import { isValidEmail } from 'utils/is-valid-email';
import { caseInsensitive } from 'utils/mongodb/case-insensitive';
import { ValidationError } from 'utils/validation/validation-error';
import { ValidationErrorCode } from 'utils/validation/validation-error-code';

async function validateEmailAddress(req: ApiRequest<NewUserRequest>) {
  const emailAddress = req.body.userEmailAddress;

  const emailIsInvalid = !isValidEmail(emailAddress);
  if (emailIsInvalid) {
    throw new ValidationError(
      ValidationErrorCode.CreateUser_Email_Invalid,
      emailAddress
    );
  }

  const emailIsTaken = await User.exists({
    userEmailAddress: caseInsensitive(emailAddress),
  });
  if (emailIsTaken) {
    throw new ValidationError(
      ValidationErrorCode.CreateUser_Email_Taken,
      emailAddress
    );
  }
}

async function validateFullName(req: ApiRequest<NewUserRequest>) {
  const fullName = req.body.userFullName;

  const fullNameIsTooShort =
    fullName.length < userValidation.userFullName.minLength;
  if (fullNameIsTooShort) {
    throw new ValidationError(
      ValidationErrorCode.CreateUser_FullName_TooShort,
      fullName
    );
  }

  const fullNameIsTooLong =
    fullName.length > userValidation.userFullName.maxLength;
  if (fullNameIsTooLong) {
    throw new ValidationError(
      ValidationErrorCode.CreateUser_FullName_TooLong,
      fullName
    );
  }
}

async function validateHandle(req: ApiRequest<NewUserRequest>) {
  const handle = req.body.userHandle;
  const handleIsTooShort = handle.length < userValidation.userHandle.minLength;
  if (handleIsTooShort) {
    throw new ValidationError(
      ValidationErrorCode.CreateUser_Handle_TooShort,
      handle
    );
  }

  const handleIsTooLong = handle.length > userValidation.userHandle.maxLength;
  if (handleIsTooLong) {
    throw new ValidationError(
      ValidationErrorCode.CreateUser_Handle_TooLong,
      handle
    );
  }

  const handleIsTaken = await User.exists({
    userHandle: caseInsensitive(handle),
  });
  if (handleIsTaken) {
    throw new ValidationError(
      ValidationErrorCode.CreateUser_Handle_Taken,
      handle
    );
  }
}

export async function validate(req: ApiRequest<NewUserRequest>) {
  await validateEmailAddress(req);
  await validateFullName(req);
  await validateHandle(req);
}
