import { Link, LinkType } from './page-designer-subform';

export function isLinkValid(link: Link) {
  switch (link.type) {
    case LinkType.SMS:
      return !!link.phoneNumber;
    case LinkType.WhatsApp:
      return !!link.phoneNumber;
    case LinkType.Email:
      return !!link.emailAddress;
    default:
      throw new TypeError('Link type not accounted for');
  }
}
