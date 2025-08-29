import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // This is a placeholder middleware. 
  // You can add authentication logic here in the future.
  return NextResponse.next();
}

export const config = {
  // Match all paths except for static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
