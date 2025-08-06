import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'ur'],
  defaultLocale: 'en',
  // Redirect internal paths, but not the root.
  urlMappingStrategy: 'redirect', 
});

export function middleware(request: NextRequest) {
  // If the request is for the root path, do not run the i18n middleware.
  // This allows the setup page at `/` to load without a locale.
  if (request.nextUrl.pathname === '/') {
    return;
  }
  
  return I18nMiddleware(request);
}

export const config = {
  // Match all paths except for static files, API routes, and the favicon.
  // Crucially, this does not match the root path `/` because of the `+` quantifier.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).+)'],
};
