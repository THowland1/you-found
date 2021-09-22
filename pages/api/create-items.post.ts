import {
  INewItemsRequest,
  INewItemsRequestItemPage,
  INewItemsRequestItemPageLink,
  INewItemsRequestItemPageLinkType
} from 'models/api/new-items-request';
import {
  INewItemsResponse,
  INewItemsResponseItem
} from 'models/api/new-items-response';
import {
  IItem,
  IItemPage,
  IItemPageLink,
  IItemPageLinkType,
  Item
} from 'models/schema/item';
import { IUser, User } from 'models/schema/user';
import { Types } from 'mongoose';
import type { NextApiResponse } from 'next';
import { ApiPostRequest } from 'utils/api/api-request';
import { ValidationError } from 'utils/validation/validation-error';
import { validate } from './create-items.post.validate';

function mapItemPageLink(
  itemPageLink: INewItemsRequestItemPageLink
): IItemPageLink {
  switch (itemPageLink.type) {
    case INewItemsRequestItemPageLinkType.SMS:
      return {
        linkId: itemPageLink.linkId,
        type: IItemPageLinkType.SMS,
        text: itemPageLink.text,
        phoneNumberId: itemPageLink.phoneNumberId
      };
    case INewItemsRequestItemPageLinkType.WhatsApp:
      return {
        linkId: itemPageLink.linkId,
        type: IItemPageLinkType.WhatsApp,
        text: itemPageLink.text,
        phoneNumberId: itemPageLink.phoneNumberId
      };
    case INewItemsRequestItemPageLinkType.Email:
      return {
        linkId: itemPageLink.linkId,
        type: IItemPageLinkType.Email,
        text: itemPageLink.text,
        emailAddressId: itemPageLink.emailAddressId
      };
    default:
      throw new TypeError('Link Type not accounted for');
  }
}

function mapItemPage(itemPage: INewItemsRequestItemPage): IItemPage {
  return {
    links: itemPage.links.map(mapItemPageLink),
    message: itemPage.message
  };
}

export async function post(
  req: ApiPostRequest<INewItemsRequest>,
  res: NextApiResponse<INewItemsResponse>
) {
  try {
    await validate(req);
    const newItems = req.body.items.map<IItem>(item => ({
      itemName: item.itemName,
      itemPage: mapItemPage(item.itemPage),
      user: Types.ObjectId(req.body.userId)
    }));
    const newItemDocuments = await Item.create(newItems);
    const responseBody: INewItemsResponse = {
      items: newItemDocuments.map<INewItemsResponseItem>(itemDoc => ({
        itemId: itemDoc._id!.toHexString(),
        itemName: itemDoc.itemName
      }))
    };
    res.status(200).json(responseBody);
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json(e as unknown as any);
    } else {
      res.status(500);
    }
  } finally {
    res.end();
  }
}
