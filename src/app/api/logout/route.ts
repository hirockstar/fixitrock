import { NextResponse } from 'next/server'

export async function POST() {
    // Clear the session cookie
    return new NextResponse(null, {
        status: 302,
        headers: {
            'Set-Cookie': 'session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
            Location: '/',
        },
    })
}
