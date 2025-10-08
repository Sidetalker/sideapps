import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_CANONICAL_PATH = '/__/auth';
const LEGACY_AUTH_PREFIX = '/__auth';

function shouldRewriteAuthPath(hostname: string | null, pathname: string): boolean {
  if (!pathname.startsWith(LEGACY_AUTH_PREFIX)) {
    return false;
  }

  if (!hostname) {
    return true;
  }

  if (hostname === 'sideapps.dev' || hostname.endsWith('.sideapps.dev')) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { hostname, pathname } = nextUrl;

  if (!shouldRewriteAuthPath(hostname, pathname)) {
    return NextResponse.next();
  }

  let trailing = pathname.slice(LEGACY_AUTH_PREFIX.length);

  if (!trailing || trailing === '/') {
    trailing = '/action';
  }

  if (!trailing.startsWith('/')) {
    trailing = `/${trailing}`;
  }

  const rewriteUrl = nextUrl.clone();
  rewriteUrl.pathname = `${AUTH_CANONICAL_PATH}${trailing}`;

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [`${LEGACY_AUTH_PREFIX}/:path*`],
};
