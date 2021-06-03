import { serviceAccountKey } from '../utils/db/service-account-key';

function HomePage() {
  return <pre>{JSON.stringify(serviceAccountKey)}</pre>;
}

export default HomePage;
