import { NextRequest, NextResponse } from 'next/server'

import { env } from './lib/env'

export function middleware(req: NextRequest) {
    const token = req.headers.get('authorization')

    if (!token || token !== env.API_SECRET_KEY) {
        return NextResponse.redirect(new URL('/oops', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/:path*'],
}
