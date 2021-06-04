import { Document } from 'mongoose';

export type IMongooseRef<T extends Document<TId>, TId = T['_id']> =
  | T
  | T['_id'];
