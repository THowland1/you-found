import { serviceAccountKey } from '../utils/db/service-account-key';

function HomePage({ sta }) {
  return (
    <div>
      <div>
        <pre>{JSON.stringify(sta)}</pre>
      </div>
    </div>
  );
}

export function getStaticProps() {
  return { props: { sta: serviceAccountKey } };
}

export default HomePage;
