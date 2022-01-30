import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { GetServerSidePropsContext, NextPageContext } from 'next';
import nookies from 'nookies';

type DecodedIdTokenAttempt =
  | { success: true; token: DecodedIdToken }
  | { success: false; reason: 'unauthenticated' | 'expired' };

export async function tryGetAuthToken(
  ctx: GetServerSidePropsContext
): Promise<DecodedIdTokenAttempt> {
  const cookies = nookies.get(ctx);

  if (!cookies.token) {
    return { success: false, reason: 'unauthenticated' };
  }

  try {
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    return { success: true, token };
  } catch {
    return { success: false, reason: 'expired' };
  }
}
