import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ROUTES } from './constants/routes';

const PRIVATE_ROUTES = [
  '/',
  '/free-mode',
  '/dashboard',
  '/profile',
  '/settings',
];

export default auth(request => {
  const { user } = request.auth || {};
  const isSignedIn = !!user;
  const { pathname } = request.nextUrl;

  const isPrivatePath = PRIVATE_ROUTES.some(route =>
    pathname.startsWith(route),
  );
  const isAuthPage = pathname === ROUTES.AUTH;

  if (!isSignedIn && isAuthPage) {
    return NextResponse.next();
  }

  if (!isSignedIn && isPrivatePath) {
    return NextResponse.redirect(new URL(ROUTES.AUTH, request.nextUrl));
  }

  if (isSignedIn && isAuthPage) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/',
    '/auth',
    '/free-mode',
    '/dashboard',
    '/profile',
    '/settings',
    '/404',
  ],
};
