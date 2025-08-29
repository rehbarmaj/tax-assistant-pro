import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/']; // Add login, register, etc. here

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // This is a placeholder middleware. 
  // You can add authentication logic here in the future.
  
  // Example: If a user is not authenticated and tries to access a private route,
  // redirect them to the login page.
  // if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
  
  return NextResponse.next();
}

export const config = {
  // Match all paths except for static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
