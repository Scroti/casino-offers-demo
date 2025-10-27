import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware for:', pathname);

  if (pathname.startsWith('/admin')) {
    const accessToken = request.cookies.get('accessToken')?.value;

    console.log('🍪 Token exists:', !!accessToken);

    if (!accessToken) {
      console.log('❌ No token');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const payload = JSON.parse(
        Buffer.from(accessToken.split('.')[1], 'base64').toString()
      );

      console.log('👤 Full payload:', payload);
      console.log('🔑 Role:', payload.role);

      if (payload.role !== 'admin') {
        console.log('⛔ Not admin');
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('✅ Admin access granted');
    } catch (error) {
      console.log('💥 Error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
