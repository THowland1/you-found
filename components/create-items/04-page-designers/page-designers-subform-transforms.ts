import { Item } from '../01-names/names-subform';
import { PageDesignerSubform } from './page-designer/page-designer-subform';
import { PageDesignersSubform } from './page-designers-subform';

export function ensureNotNullCurrentItemId(target: PageDesignersSubform) {
  if (target.currentItemId) {
    return target;
  }

  const firstItemId = Object.keys(target.pages)[0];
  if (firstItemId) {
    target.currentItemId = firstItemId;
  } else {
    throw Error('There are no items to design pages for!');
  }

  return target;
}

export function hasNextItemId(target: PageDesignersSubform) {
  if (!target.currentItemId) {
    throw Error('No item selected!');
  }
  const itemIds = Object.keys(target.pages);
  const currentItemIdIndex = itemIds.indexOf(target.currentItemId);

  if (currentItemIdIndex === -1) {
    throw Error('Current item does not exist!');
  }
  return currentItemIdIndex < itemIds.length - 1;
}

export function getNextItemId(target: PageDesignersSubform) {
  if (!target.currentItemId) {
    throw Error('No item selected!');
  }
  const itemIds = Object.keys(target.pages);
  const currentItemIdIndex = itemIds.indexOf(target.currentItemId);

  if (currentItemIdIndex === -1) {
    throw Error('Current item does not exist!');
  }

  if (!hasNextItemId(target)) {
    throw Error('Has no next item!');
  }

  return itemIds[currentItemIdIndex + 1];
}

export function refreshPages(target: PageDesignersSubform, items: Item[]) {
  const expectedItemIds = items.map((o) => o.id);
  const actualItemIds = Object.keys(target.pages);

  const idsToAdd = expectedItemIds.filter(
    (expectedId) => !actualItemIds.includes(expectedId)
  );
  const idsToRemove = actualItemIds.filter(
    (actualItemId) => !expectedItemIds.includes(actualItemId)
  );

  idsToAdd.forEach((idToAdd) => {
    target.pages[idToAdd] = new PageDesignerSubform();
  });
  idsToRemove.forEach((idToRemove) => {
    delete target.pages[idToRemove];
  });

  return target;
}
