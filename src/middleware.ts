import { NextRequest, NextResponse } from 'next/server'

import { env } from './lib/env'

// Helper: Only run this logic for /login
export async function middleware(req: NextRequest) {
    const url = req.nextUrl

    // List of API routes to skip protection
    const openApiRoutes = ['/api/sessionLogin', '/api/logout', '/api/drive/og']

    if (openApiRoutes.some((route) => url.pathname.startsWith(route))) {
        return NextResponse.next()
    }

    // Protect /login route
    if (url.pathname === '/login') {
        const sessionCookie = req.cookies.get('session')?.value
        const username = req.cookies.get('username')?.value

        if (sessionCookie && username) {
            return NextResponse.redirect(new URL(`/@${username}`, req.url))
        } else if (sessionCookie) {
            // fallback: if username missing, just redirect to home
            return NextResponse.redirect(new URL('/', req.url))
        }

        // If not logged in, allow access to /login
        return NextResponse.next()
    }

    // Only apply API secret check to /api/* routes
    if (url.pathname.startsWith('/api/')) {
        const token = req.headers.get('authorization')

        if (!token || token !== env.API_SECRET_KEY) {
            return NextResponse.redirect(new URL('/oops', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/:path*', '/login'],
}
