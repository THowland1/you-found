import { GetServerSideProps, NextPage } from 'next';

/**
 * This file doesn't  hold a page, so I just chuck people out
 */
const Redirect: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: { destination: '404', statusCode: 404, permanent: false },
    props: {}
  };
};

export default Redirect;
