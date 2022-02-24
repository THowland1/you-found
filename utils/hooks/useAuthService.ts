import firebase from 'firebase/app';
import useFirebase from 'utils/hooks/useFirebase';

type Result<TSuccess> =
  | ({
      success: true;
    } & TSuccess)
  | {
      success: false;
      error: Error;
    };

export type IAuthenticationResult = Result<{
  userCredential: firebase.auth.UserCredential;
}>;
export type IConfirmationResult = Result<{
  confirmationResult: firebase.auth.ConfirmationResult;
}>;

export type ISuccessResult = { success: true };
export type IFailureResult = { success: false; error: Error };
export type IResult = ISuccessResult | IFailureResult;

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

  async function registerAnonymously(): Promise<IAuthenticationResult> {
    return firebase
      .auth()
      .signInAnonymously()
      .then(userCredential => ({ success: true, userCredential } as const))
      .catch(error => ({ success: false, error: error as Error } as const));
  }

  async function linkUserWithCredentials(
    user: firebase.User,
    credentials: ICredentials
  ): Promise<IAuthenticationResult> {
    const { emailAddress, password } = credentials;
    const credential = firebase.auth.EmailAuthProvider.credential(
      emailAddress,
      password
    );

    return user
      .linkWithCredential(credential)
      .then(userCredential => ({ success: true, userCredential } as const))
      .catch(error => ({ success: false, error: error as Error } as const));
  }

  async function linkWithPhoneNumber(
    user: firebase.User,
    phoneNumber: string
  ): Promise<IConfirmationResult> {
    const invisibleCaptcha = new firebase.auth.RecaptchaVerifier(
      'new-phone-number-submit',
      {
        size: 'invisible'
      }
    );

    return user
      .linkWithPhoneNumber(phoneNumber, invisibleCaptcha)
      .then(
        confirmationResult => ({ success: true, confirmationResult } as const)
      )
      .catch(error => ({ success: false, error: error as Error } as const));
  }

  async function updateUserDisplayName(displayName: string): Promise<IResult> {
    const user = firebase.auth().currentUser;
    if (!user) {
      return {
        success: false,
        error: new Error(
          'Could not set display name of user, there is no current user'
        )
      };
    }
    return user
      .updateProfile({ displayName })
      .then(() => ({ success: true } as const))
      .catch(error => ({ success: false, error: error as Error } as const));
  }

  async function logout(): Promise<void> {
    return firebase.auth().signOut();
  }

  return {
    loginOrRegisterWithFacebookPopup,
    loginOrRegisterWithGooglePopup,
    registerWithCredentials,
    loginWithCredentials,
    updateUserDisplayName,
    registerAnonymously,
    linkUserWithCredentials,
    linkWithPhoneNumber,
    logout
  };
};
