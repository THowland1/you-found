import 'firebase/auth';
import firebase from 'firebase/app';
import { useEffect, useMemo, useState } from 'react';

var firebaseConfig = {
  apiKey: 'AIzaSyAV5Af9XsxaXHmKgCa0h2_fiwHsH_4d0LA',
  authDomain: 'you-found.firebaseapp.com',
  projectId: 'you-found',
  storageBucket: 'you-found.appspot.com',
  messagingSenderId: '295636843494',
  appId: '1:295636843494:web:ac123f3a891dea2940b427',
  measurementId: 'G-KRR9KLB6X6'
};

type providerOptions =
  | 'password'
  | 'phone'
  | 'google.com'
  | 'apple.com'
  | 'facebook.com';

const useFirebase = () => {
  const firebaseAuth = useMemo(() => {
    try {
      return firebase.auth();
    } catch (e) {
      firebase.initializeApp(firebaseConfig);
      return firebase.auth();
    }
  }, []);
  const [user, setUser] = useState<firebase.User | null>(
    firebaseAuth.currentUser
  );
  useEffect(() => firebaseAuth?.onAuthStateChanged(user => setUser(user)));
  const userHasProvider = (provider: providerOptions) =>
    firebaseAuth?.currentUser?.providerData.some(
      x => x?.providerId === provider
    );
  const createVerifier = (object: HTMLDivElement) =>
    new firebase.auth.RecaptchaVerifier(object, {
      size: 'invisible',
      callback: (response: unknown) => {}
    });
  const userHasEmail = () => !!firebaseAuth?.currentUser?.email;
  return {
    firebaseAuth,
    userHasProvider,
    userHasEmail,
    createVerifier,
    user
  };
};
export default useFirebase;
