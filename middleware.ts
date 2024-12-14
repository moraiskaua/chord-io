import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ROUTES } from './constants/routes';

export default auth(request => {
  const isSignedIn = !!request.auth;
  const isPrivatePath = request.nextUrl.pathname.startsWith('/play');

  if (isSignedIn && !isPrivatePath) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.nextUrl));
  }

  if (!isSignedIn && isPrivatePath) {
    return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.nextUrl));
  }
});

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/free-mode',
    '/play/welcome',
    '/play/dashboard',
    '/play/profile',
    '/play/settings',
    '/404',
  ],
};
