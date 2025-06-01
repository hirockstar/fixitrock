// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'

const clientId = ''
const clientSecret = ''
const redirectUri = 'http://localhost:3000/api/auth/callback'

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code')

    if (!code) {
        return NextResponse.json({ error: 'No code found in query' }, { status: 400 })
    }

    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            scope: 'files.read offline_access',
            code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            client_secret: clientSecret,
        }),
    })

    const tokenData = await tokenRes.json()

    return NextResponse.json(tokenData)
}
