import { Document, Types } from 'mongoose';

export type IMongooseDocument<T> = T & Document<Types.ObjectId>;
