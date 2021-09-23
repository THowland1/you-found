import firebase from 'firebase';
import nookies from 'nookies';
import { createContext, useEffect, useState } from 'react';
import useFirebase from 'utils/hooks/useFirebase';

// Lovingly copied from https://colinhacks.com/essays/nextjs-firebase-authentication

export const AuthContext = createContext<{ user: firebase.User | null }>({
  user: null
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<firebase.User | null>(null);
  useFirebase();

  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async user => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, 'token', token, { path: '/' });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
