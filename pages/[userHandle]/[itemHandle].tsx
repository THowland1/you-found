import styles from './[itemHandle].module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComments, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { getUserAndItem } from '../api/[user]/[item]';
import { GetServerSideProps } from 'next';
import { IUser, IUserItem } from '../../models/schema/user';

type ServerSideProps = {
  user: IUser;
  item: IUserItem;
};

export default function ItemPage({ user, item }: ServerSideProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p>
          Hi, I'm <mark>{user.userFullName}</mark> and you have found my{' '}
          <mark>{item.itemName}</mark>
        </p>
      </header>
      <main className={styles.main}>
        <div className={styles.cta}>
          I would appreciate it if you could get in touch, and I'd be happy to
          come and get it
        </div>
        <a
          className={styles.contactMethod}
          href={'mailto:' + user.userEmailAddress}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <span className={styles.a}>By email</span>
        </a>
        <a
          className={styles.contactMethod}
          href={'sms:' + user.userPhoneNumber}
        >
          <FontAwesomeIcon icon={faComments} />
          <span className={styles.a}>By text</span>
        </a>
        <a
          className={styles.contactMethod}
          href={'https://wa.me/' + user.userPhoneNumber}
        >
          <FontAwesomeIcon icon={faWhatsapp} />
          <span className={styles.a}>By WhatsApp</span>
        </a>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query,
}) => {
  const { user, item } = await getUserAndItem(
    query.userHandle as string,
    query.itemHandle as string
  );
  return { props: { user, item } };
};
