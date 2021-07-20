export interface INewItemsResponseItem {
  itemId: string;
  itemName: string;
}

export interface INewItemsResponse {
  items: INewItemsResponseItem[];
}
