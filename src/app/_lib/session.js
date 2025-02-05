import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);

const cookie = {
  name: 'session',
  options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
  duration: 1000 * 60 * 30,
};

/*
    SESSION PAYLOAD
    userId: string
    expiresAt: Date
*/
async function encrypt(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('30m').sign(key);
}

export async function decrypt(session = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (e) {
    console.log('Failed to verify Session');
  }
}

export async function createSession(userId) {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({ userId, expires });

  (await cookies()).set(cookie.name, session, { ...cookie.options, expires });
  redirect('/');
}

export async function setTempSession(payload) {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt(payload);
  (await cookies()).set('temp', session, { ...cookie.options, expires });
}

export async function getTempSession() {
  const cookie = (await cookies()).get('temp')?.value;
  const value = await decrypt(cookie);
  return value;
}

export async function verifySession() {
  const currentCookie = (await cookies()).get(cookie.name)?.value;
  const session = await decrypt(currentCookie);
  if (!session?.userId) {
    redirect('/auth/login');
  }
  return { userId: session.userId };
}

export async function deleteSession() {
  (await cookies()).delete(cookie.name);
  redirect('/auth/login');
}
