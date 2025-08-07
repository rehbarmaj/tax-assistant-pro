import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'ur'],
  defaultLocale: 'en',
  urlMappingStrategy: 'redirect', 
});

export function middleware(request: NextRequest) {
  // If the request is for the root, and it's not a framework request,
  // let it pass through to the setup page (`/app/page.tsx`).
  if (request.nextUrl.pathname === '/') {
    return;
  }
  return I18nMiddleware(request);
}

export const config = {
  // Match all paths except for static files, API routes, and the root page
  // The root page is now handled explicitly to show the setup wizard.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)'],
};
