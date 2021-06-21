import { Document, Types } from 'mongoose';

export type IMongooseRef<T extends Document<Types.ObjectId>> = T | T['_id'];
