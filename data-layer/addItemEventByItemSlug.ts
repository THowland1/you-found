import connectDB from 'middleware/mongodb';
import {
  IItemEvent,
  IItemSchema,
  Item,
  IItemEventSchema
} from 'models/schema/item';
import { z } from 'zod';

export async function addItemEventByItemSlug(
  itemSlug: string,
  newEvent: IItemEvent
) {
  await connectDB();

  z.string().parse(itemSlug);
  const newEventValue = IItemEventSchema.parse(newEvent);

  const item = await Item.findOneAndUpdate(
    { itemSlug },
    { $push: { events: newEventValue } },
    { new: true }
  );
  if (item) {
    return { found: true, item: IItemSchema.parse(item) } as const;
  } else {
    return { found: false } as const;
  }
}
