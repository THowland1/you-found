import { userValidation } from 'models/schema/user';
import { EnumMap } from 'utils/enum-map';
import { ValidationErrorCode } from './validation-error-code';
import { compileTimeTypeCheck } from 'utils/compile-time-type-check';

export const VALIDATION_ERROR_MESSAGES = {
  [ValidationErrorCode.CreateUser_Email_Invalid]: (email: string) =>
    `"${email}" is not a valid email address!`,
  [ValidationErrorCode.CreateUser_Email_Taken]: (email: string) =>
    `"${email}" is already taken!`,
  [ValidationErrorCode.CreateUser_Handle_TooShort]: (handle: string) =>
    `"${handle}" is too short a handle! (please make it between ${userValidation.userHandle.minLength} and ${userValidation.userHandle.maxLength})`,
  [ValidationErrorCode.CreateUser_Handle_TooLong]: (handle: string) =>
    `"${handle}" is too long a handle! (please make it between ${userValidation.userHandle.minLength} and ${userValidation.userHandle.maxLength})`,
  [ValidationErrorCode.CreateUser_Handle_Taken]: (handle: string) =>
    `"The handle "${handle}" is already taken!`,
  [ValidationErrorCode.CreateUser_FullName_TooShort]: (fullName: string) =>
    `"${fullName}" is too short a name! (please make it between ${userValidation.userFullName.minLength} and ${userValidation.userFullName.maxLength})`,
  [ValidationErrorCode.CreateUser_FullName_TooLong]: (fullName: string) =>
    `"${fullName}" is too long a name! (please make it between ${userValidation.userFullName.minLength} and ${userValidation.userFullName.maxLength})`,

  [ValidationErrorCode.GetItem_User_NotFound]: (userHandle: string) =>
    `Could not find a user with a handle of "${userHandle}"`,
  [ValidationErrorCode.GetItem_Item_NotFound]: (
    userFullName: string,
    itemHandle: string
  ) => `${userFullName} does not have an item with a handle of "${itemHandle}"`,
};

compileTimeTypeCheck<EnumMap<ValidationErrorCode>>(VALIDATION_ERROR_MESSAGES);
