import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComments, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkType } from 'components/create-items/04-page-designers/page-designer/page-designer-subform';
import { YouFoundPageLink as YouFoundPageLinkModel } from 'models/api/you-found-page-link';
import styles from './you-found-page.module.scss';

export interface Props {
  link: YouFoundPageLinkModel;
}

function getLinkHref(link: YouFoundPageLinkModel) {
  switch (link.type) {
    case LinkType.SMS:
      return `sms: ${link.phoneNumber}`;
    case LinkType.WhatsApp:
      return `https://wa.me/${link.phoneNumber}`;
    case LinkType.Email:
      return `mailto: ${link.emailAddress}`;
    default:
      throw new TypeError(
        'No URL could be constructed for the given link type'
      );
  }
}
function getLinkIcon(link: YouFoundPageLinkModel) {
  return {
    [LinkType.SMS]: faComments,
    [LinkType.WhatsApp]: faWhatsapp,
    [LinkType.Email]: faEnvelope,
  }[link.type];
}

export default function YouFoundPageLink({ link }: Props) {
  return (
    <a className={styles.contactMethod} href={getLinkHref(link)}>
      <FontAwesomeIcon icon={getLinkIcon(link)} />
      <span className={styles.a}>{link.label}</span>
    </a>
  );
}
