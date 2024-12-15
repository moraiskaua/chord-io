import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ROUTES } from './constants/routes';

const PRIVATE_ROUTES = [
  '/play/welcome',
  '/play/dashboard',
  '/play/profile',
  '/play/settings',
];

export default auth(request => {
  const isSignedIn = !!request.auth?.user;
  const isPrivatePath = PRIVATE_ROUTES.some(route =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isSignedIn && !isPrivatePath) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.nextUrl));
  }

  if (!isSignedIn && isPrivatePath) {
    return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.nextUrl));
  }
});

export const config = {
  matcher: ['/', '/sign-in', '/sign-up', '/free-mode', '/play/:path*', '/404'],
};
