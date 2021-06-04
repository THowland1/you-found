import connectDB from '../../../middleware/mongodb';
import { IUser, IUserItem, User } from '../../../models/schema/user';

export const getUserAndItem = async (
  userHandle: string,
  itemHandle: string
): Promise<{ user: IUser; item: IUserItem }> => {
  await connectDB();
  const userDocument = (await User.findOne({ userHandle })).toObject();
  const { _id, __v, id, ...user } = userDocument;
  const item = user.userItems.filter(
    (userItem) => userItem.itemHandle === itemHandle
  )[0];

  return { user, item };
};
