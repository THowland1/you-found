import styles from './[itemHandle].module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComments, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { getUserAndItem } from '../api/[userId]/[itemId]';
import { GetServerSideProps } from 'next';
import { IUser, IUserItem } from '../../models/schema/user';

type ServerSideProps = {
  user: IUser;
  item: IUserItem;
};

export default function ItemPage({ user, item }: ServerSideProps) {
  return (
    <></>
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
