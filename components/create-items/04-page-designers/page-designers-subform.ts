import { PageDesignerSubform } from './page-designer/page-designer-subform';

export class PageDesignersSubform {
  currentItemId: string | null = null;
  pages: { [itemId: string]: PageDesignerSubform } = {};
}
