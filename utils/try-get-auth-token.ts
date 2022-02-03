import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import nookies from 'nookies';

type DecodedIdTokenAttempt =
  | { success: true; token: DecodedIdToken }
  | { success: false; reason: 'unauthenticated' | 'expired' };

type TryGetAuthTokenArg =
  | ['getServerSideProps', GetServerSidePropsContext]
  | ['NextApiRequest', NextApiRequest];

function getBearerToken(arg: TryGetAuthTokenArg) {
  switch (arg[0]) {
    case 'NextApiRequest':
      return arg[1].cookies.token;
    case 'getServerSideProps':
      return nookies.get(arg[1]).token;
    default:
      return null;
  }
}

export async function tryGetAuthToken(
  arg: TryGetAuthTokenArg
): Promise<DecodedIdTokenAttempt> {
  const bearer = getBearerToken(arg);
  if (!bearer) {
    return { success: false, reason: 'unauthenticated' };
  }

  try {
    const token = await firebaseAdmin.auth().verifyIdToken(bearer);
    return { success: true, token };
  } catch {
    return { success: false, reason: 'expired' };
  }
}
