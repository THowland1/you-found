import { getItemsByFirebaseUserId } from 'data-layer/getItemsByFirebaseUserId';
import connectDB from 'middleware/mongodb';
import { newItemSchema } from 'models/new-item';
import { IItem, IItemSchema, Item } from 'models/schema/item';
import { NextApiRequest, NextApiResponse } from 'next';
import { tryGetAuthToken } from 'utils/try-get-auth-token';
import { z } from 'zod';

const BASE_31_INDEX_TABLE = '0123456789bcdfghjklmnpqrstvwxyz';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const tokenAttempt = await tryGetAuthToken(['NextApiRequest', req]);
    if (!tokenAttempt.success) {
      return res.status(401).json({ reason: tokenAttempt.reason });
    }
    const token = tokenAttempt.token;
    switch (req.method) {
      case 'GET':
        const items = (await getItemsByFirebaseUserId(token.uid)) as IItem[];
        res.status(200).json(items);
      case 'POST':
        const randomId = generateRandomIdAsIntAndString(5);
        const formData = newItemSchema.parse(req.body);

        // TODO - Make this collision-proof
        const newItem: IItem = {
          itemId: randomId.asBase10Int,
          itemSlug: randomId.asBase31String,
          firebaseUserId: token.uid,
          headline: formData.headline,
          itemName: formData.itemName,
          message: formData.message,
          events: [],
          links: [
            {
              linkType: 'email',
              showButton: formData.showEmailLink,
              buttonText: 'Send me an email',
              emailAddress: formData.emailAddress
            },
            {
              linkType: 'whatsapp',
              showButton: formData.showWhatsAppLink,
              buttonText: 'Message me on WhatsApp',
              phoneNumber: formData.phoneNumber
            },
            {
              linkType: 'call',
              showButton: formData.showPhoneCallLink,
              buttonText: 'Send me an email',
              phoneNumber: formData.phoneNumber
            },
            {
              linkType: 'sms',
              showButton: formData.showSMSLink,
              buttonText: 'Send me a text',
              phoneNumber: formData.phoneNumber
            }
          ]
        };
        const newItemDocument = await Item.create(newItem);
        const item = IItemSchema.parse(newItemDocument);
        res.status(200).json(item);
        break;
      default:
        res.status(404);
        break;
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({});
  }
};

function generateRandomIdAsIntAndString(length: number) {
  const randomInt = randomIntBuilder()
    .greaterThanOrEqualTo(0)
    .lessThan(Math.pow(31, length));

  const randomIntAsString = convertBase('10-to-31', String(randomInt));

  return {
    asBase10Int: randomInt,
    asBase31String: randomIntAsString
  };
}

function randomIntBuilder() {
  return {
    greaterThanOrEqualTo: function (min: number) {
      return {
        lessThan: function (max: number) {
          const unitRand = Math.random(); // 0 ≤ x < 1
          const randScaled = (max - min) * unitRand; // 0 ≤ x < (max - min)
          const randScaledAndPanned = randScaled - min; // min ≤ x < max
          return Math.floor(randScaledAndPanned); // min ≤ x < max;
        }
      };
    }
  };
}

function convertBase(direction: '10-to-31' | '31-to-10', value: string) {
  const converter = baseConverterBuilder(BASE_31_INDEX_TABLE);
  switch (direction) {
    case '10-to-31':
      return converter.convert(value).fromBase(10).toBase(31);
    case '31-to-10':
      return converter.convert(value).fromBase(31).toBase(10);
    default:
      throw new TypeError('Pick a base convert direction');
  }
}

function baseConverterBuilder(indexTable: string) {
  return {
    convert: function (value: string) {
      return {
        fromBase: function (from_base: number) {
          return {
            toBase: function (to_base: number) {
              var from_range = indexTable.slice(0, from_base);
              var to_range = indexTable.slice(0, to_base);

              var dec_value = value
                .split('')
                .reverse()
                .reduce(function (carry, digit, index) {
                  if (from_range.indexOf(digit) === -1)
                    throw new Error(
                      'Invalid digit `' +
                        digit +
                        '` for base ' +
                        from_base +
                        '.'
                    );
                  return (carry +=
                    from_range.indexOf(digit) * Math.pow(from_base, index));
                }, 0);

              var new_value = '';
              while (dec_value > 0) {
                new_value = to_range[dec_value % to_base] + new_value;
                dec_value = (dec_value - (dec_value % to_base)) / to_base;
              }
              return new_value || '0';
            }
          };
        }
      };
    }
  };
}
