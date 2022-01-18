import * as firebaseAdmin from 'firebase-admin';
import secret from 'secret.json';

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(secret as any)
  });
}

export { firebaseAdmin };
