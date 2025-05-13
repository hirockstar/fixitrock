import { NextRequest, NextResponse } from 'next/server'

import { env } from './lib/env'

export function middleware(req: NextRequest) {
    const url = req.nextUrl

    // List of API routes to skip protection
    const openApiRoutes = ['/api/sessionLogin', '/api/logout', '/api/drive/og']
    if (openApiRoutes.some((route) => url.pathname.startsWith(route))) {
        return NextResponse.next()
    }

    const token = req.headers.get('authorization')
    if (!token || token !== env.API_SECRET_KEY) {
        return NextResponse.redirect(new URL('/oops', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/:path*'],
}
