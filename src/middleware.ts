import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'ur'],
  defaultLocale: 'en',
  urlMappingStrategy: 'redirect', 
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|setup|favicon.ico).*)'],
};
