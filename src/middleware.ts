import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'ur'],
  defaultLocale: 'en',
  // Never redirect for the root path, as it's our setup page
  urlMappingStrategy: 'never', 
});

export function middleware(request: NextRequest) {
  // If the request is for the root path, do not run the middleware.
  // This allows the setup page to load without a locale.
  if (request.nextUrl.pathname === '/') {
    return;
  }
  
  return I18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
