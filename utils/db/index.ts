import admin from 'firebase-admin';
import { serviceAccountKey } from './service-account-key';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey as any),
      databaseURL: 'https://found-myeur3.firebasedatabase.app',
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();
