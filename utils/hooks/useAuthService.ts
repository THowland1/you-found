import firebase from 'firebase/app';
import useFirebase from 'utils/hooks/useFirebase';

export type IAuthenticationSuccessResult = {
  success: true;
  userCredential: firebase.auth.UserCredential;
};
export type IAuthenticationFailureResult = {
  success: false;
  error: Error;
};

export type IAuthenticationResult =
  | IAuthenticationSuccessResult
  | IAuthenticationFailureResult;

export interface ICredentials {
  emailAddress: string;
  password: string;
}

export const useAuthService = () => {
  useFirebase();

  async function loginOrRegisterWithFacebookPopup(): Promise<IAuthenticationResult> {
    const provider = new firebase.auth.FacebookAuthProvider();

    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(userCredential => ({ success: true, userCredential } as const))
      .catch(error => ({ success: false, error: error as Error } as const));
  }

  async function loginOrRegisterWithGooglePopup(): Promise<IAuthenticationResult> {
    const provider = new firebase.auth.GoogleAuthProvider();

    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(userCredential => ({ success: true, userCredential } as const))
      .catch(error => ({ success: false, error: error as Error } as const));
  }

  async function loginWithCredentials(
    credentials: ICredentials
  ): Promise<IAuthenticationResult> {
    const { emailAddress, password } = credentials;
    return firebase
      .auth()
      .signInWithEmailAndPassword(emailAddress, password)
      .then(userCredential => ({ success: true, userCredential } as const))
      .catch(error => ({ success: false, error: error as Error } as const));
  }

  async function registerWithCredentials(
    credentials: ICredentials
  ): Promise<IAuthenticationResult> {
    const { emailAddress, password } = credentials;
    return firebase
      .auth()
      .createUserWithEmailAndPassword(emailAddress, password)
      .then(userCredential => ({ success: true, userCredential } as const))
      .catch(error => ({ success: false, error: error as Error } as const));
  }

  return {
    loginOrRegisterWithFacebookPopup,
    loginOrRegisterWithGooglePopup,
    registerWithCredentials,
    loginWithCredentials
  };
};
