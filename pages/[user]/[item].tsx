import db from '../../utils/db';
import styles from './[item].module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComments, faEnvelope } from '@fortawesome/free-regular-svg-icons';

type UserDetails = {
  emailAddress: string;
  fullName: string;
  handle: string;
  phoneNumber: string;
};

type ItemDetails = {
  itemName: string;
};

type ServerSideProps = {
  userDetails: UserDetails;
  itemDetails: ItemDetails;
  userId: string;
  itemId: string;
};

export default function ItemPage({
  userDetails,
  userId,
  itemDetails,
  itemId,
}: ServerSideProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p>
          Hi, I'm <mark>{userDetails.fullName}</mark> and you have found my{' '}
          <mark>{itemDetails.itemName}</mark>
        </p>
      </header>
      <main className={styles.main}>
        <div className={styles.cta}>
          I would appreciate it if you could get in touch, and I'd be happy to
          come and get it
        </div>

        <a
          className={styles.contactMethod}
          href={'mailto:' + userDetails.emailAddress}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <span className={styles.a}>By email</span>
        </a>
        <a
          className={styles.contactMethod}
          href={'sms:' + userDetails.phoneNumber}
        >
          <FontAwesomeIcon icon={faComments} />
          <span className={styles.a}>By text</span>
        </a>
        <a
          className={styles.contactMethod}
          href={'https://wa.me/' + userDetails.phoneNumber}
        >
          <FontAwesomeIcon icon={faWhatsapp} />
          <span className={styles.a}>By WhatsApp</span>
        </a>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ query }) => {
  const { user, item } = query;
  const userDoc = db.collection('users').doc(user);
  const itemDoc = userDoc.collection('items').doc(item);

  const userId = userDoc.id;
  const itemId = itemDoc.id;

  const userDetails = (await userDoc.get()).data() as UserDetails;
  const itemDetails = (await itemDoc.get()).data() as ItemDetails;

  const props: ServerSideProps = { userDetails, userId, itemDetails, itemId };

  return { props };
};
