// middleware.ts (placer à la racine du projet Next)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Si visite racine, rediriger vers /login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Exemple d'UX : si on accède à /login et qu'on a déjà un cookie "token", rediriger vers /dashboard
  const token = req.cookies.get('token')?.value;
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// matcher : limiter au minimum (ici racine et /login)
export const config = {
  matcher: ['/', '/login'],
};