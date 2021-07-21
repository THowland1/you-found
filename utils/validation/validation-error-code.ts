export enum ValidationErrorCode {
  CreateUser_Email_Invalid = 'CreateUser_Email_Invalid',
  CreateUser_Email_Taken = 'CreateUser_Email_Taken',
  CreateUser_Handle_TooShort = 'CreateUser_Handle_TooShort',
  CreateUser_Handle_TooLong = 'CreateUser_Handle_TooLong',
  CreateUser_Handle_Taken = 'CreateUser_Handle_Taken',
  CreateUser_FullName_TooShort = 'CreateUser_FullName_TooShort',
  CreateUser_FullName_TooLong = 'CreateUser_FullName_TooLong',
  GetItem_User_NotFound = 'GetItem_User_NotFound',
  GetItem_Item_NotFound = 'GetItem_Item_NotFound',
  GetUserContactDetails_User_NotFound = 'GetUserContactDetails_User_NotFound',
  UpdateUserContactDetails_User_NotFound = 'UpdateUserContactDetails_User_NotFound',
}
