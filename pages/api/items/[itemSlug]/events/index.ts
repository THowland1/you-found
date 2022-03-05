import { addItemEventByItemSlug } from 'data-layer/addItemEventByItemSlug';
import connectDB from 'middleware/mongodb';
import { IItemEventSchema } from 'models/schema/item';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import sendgrid from 'middleware/sendgrid';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { renderEmailTemplate } from 'components/email-templates/EmailTemplate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const itemSlug = z.string().parse(req.query.itemSlug);
    const itemEvent = IItemEventSchema.parse(req.body);

    switch (req.method) {
      case 'POST':
        const item = await addItemEventByItemSlug(itemSlug, itemEvent);

        // TODO - Handle failures gracefully
        if (item.found) {
          const { email } = await firebaseAdmin
            .auth()
            .getUser(item.item.firebaseUserId);

          if (email) {
            switch (itemEvent.eventType) {
              case 'MessageSent':
                const { html } = renderEmailTemplate({
                  itemName: item.item.itemName,
                  message: itemEvent.messageSentProps.message
                });
                await sendgrid.sendEmail({
                  to: email,
                  subject: `[${item.item.itemName}] Someone sent you a message`,
                  html
                });
                break;
              default:
                break;
            }
          }

          res.status(200).json(item);
        } else {
          res.status(404).end();
        }
        break;
      default:
        res.status(404).end();
        break;
    }
  } catch (e) {
    res.status(500).end();
  }
};
