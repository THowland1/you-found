import {
  INewItemsResponse,
  INewItemsResponseItem,
} from 'models/api/new-items-response';
import { ConfirmSubform, ConfirmSubformItem } from './confirm-subform';

export function mapResponseBodyToSubform(
  body: INewItemsResponse
): ConfirmSubform {
  return {
    items: body.items.map(mapResponseBodyItemToSubformItem),
  };
}

function mapResponseBodyItemToSubformItem(
  item: INewItemsResponseItem
): ConfirmSubformItem {
  return {
    itemId: item.itemId,
    itemName: item.itemName,
  };
}
