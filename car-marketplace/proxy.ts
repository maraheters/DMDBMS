import { NextResponse, type NextRequest } from 'next/server';
import { verifySession } from './lib/auth';

// 1. Specify the paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (the login page)
     * - /register (the register page)
     *
     * By removing '$' from the original negative lookahead,
     * this matcher will now ALSO run on the root path '/'.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};

const rolePaths: Record<number, RegExp> = {
  1: /^\/dashboard(\/.*)?$/,
  2: /^\/listings(\/.*)?$/,
};

const roleHomePages: Record<number, string> = {
  1: '/dashboard', // Admin homepage
  2: '/listings', // Client homepage
};

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const loginUrl = new URL('/login', request.url);
  const currentPath = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifySession(token);

  if (!payload) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('session', '', { maxAge: 0 });
    return response;
  }

  const userRole = payload.roleId;
  const defaultRedirectUrl = roleHomePages[userRole];

  if (currentPath === '/') {
    if (defaultRedirectUrl) {
      return NextResponse.redirect(new URL(defaultRedirectUrl, request.url));
    }

    return NextResponse.redirect(loginUrl);
  }

  const allowedPathRegex = rolePaths[userRole];

  if (allowedPathRegex && allowedPathRegex.test(currentPath)) {
    return NextResponse.next();
  }

  if (defaultRedirectUrl) {
    return NextResponse.redirect(new URL(defaultRedirectUrl, request.url));
  }

  return NextResponse.redirect(loginUrl);
}
