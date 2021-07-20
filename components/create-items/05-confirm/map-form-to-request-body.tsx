import {
  INewItemsRequest,
  INewItemsRequestItem,
  INewItemsRequestItemPage,
  INewItemsRequestItemPageLink,
  INewItemsRequestItemPageLinkType,
} from 'models/api/new-items-request';
import { Item } from '../01-names/names-subform';
import {
  EmailLink,
  Link,
  LinkType,
  SMSLink,
  WhatsAppLink,
} from '../04-page-designers/page-designer/page-designer-subform';
import { Form } from '../form';
import { Step } from '../step';

export function mapFormToRequestBody(form: Form): INewItemsRequest {
  return {
    items: mapItems(form),
    userId: form[Step.User].userId,
  };
}

function mapItems(form: Form): INewItemsRequestItem[] {
  return form[Step.Names].items.map((item) => ({
    itemName: item.name,
    itemPage: mapItemPage(form, item),
  }));
}

function mapItemPage(form: Form, item: Item): INewItemsRequestItemPage {
  const itemPage = form[Step.PageDesigners].pages[item.id];
  return {
    message: itemPage.message,
    links: itemPage.links.map(mapItemPageLink),
  };
}

function mapItemPageLink(link: Link): INewItemsRequestItemPageLink {
  switch (link.type) {
    case LinkType.SMS:
      return mapItemPageSmsLink(link);
    case LinkType.WhatsApp:
      return mapItemPageWhatsAppLink(link);
    case LinkType.Email:
      return mapItemPageEmailLink(link);
    default:
      throw new TypeError('Link type not configured');
  }
}
function mapItemPageSmsLink(smsLink: SMSLink): INewItemsRequestItemPageLink {
  return {
    type: INewItemsRequestItemPageLinkType.SMS,
    linkId: smsLink.linkId,
    phoneNumberId: smsLink.phoneNumber!.phoneNumberId,
    text: smsLink.text,
  };
}
function mapItemPageWhatsAppLink(
  smsLink: WhatsAppLink
): INewItemsRequestItemPageLink {
  return {
    type: INewItemsRequestItemPageLinkType.WhatsApp,
    linkId: smsLink.linkId,
    phoneNumberId: smsLink.phoneNumber!.phoneNumberId,
    text: smsLink.text,
  };
}
function mapItemPageEmailLink(
  smsLink: EmailLink
): INewItemsRequestItemPageLink {
  return {
    type: INewItemsRequestItemPageLinkType.Email,
    linkId: smsLink.linkId,
    emailAddressId: smsLink.emailAddress!.emailAddressId,
    text: smsLink.text,
  };
}
