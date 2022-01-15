import { ValidationError } from 'utils/validation/validation-error';
import { ValidationErrorCode } from 'utils/validation/validation-error-code';
import connectDB from '../../../../middleware/mongodb';
import { IUser, IUserItem, User } from '../../../../models/schema/user';

export const getUserAndItem = async (
  userHandle: string,
  itemHandle: string
): Promise<{ user: IUser; item: IUserItem }> => {
  await connectDB();
  const userDocument = await User.findOne({ userHandle });
  if (!userDocument) {
    throw new ValidationError(
      ValidationErrorCode.GetItem_User_NotFound,
      userHandle
    );
  }
  const { _id, __v, id, ...user } = userDocument.toObject();
  // const item = user.userItems.filter(
  //   (userItem) => userItem.itemHandle === itemHandle
  // )[0];

  // return { user, item };
  return { user: null as any, item: null as any };
};
