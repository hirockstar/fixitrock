import { adminAuth } from '®lib/firebaseAdmin'
import { logWarning } from '®lib/utils'

export async function POST(request: Request) {
    let idToken: string | undefined
    let target: string | undefined
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
        const body = await request.json()

        idToken = body.idToken
        target = body.target
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const form = await request.formData()

        idToken = form.get('idToken') as string
        target = form.get('target') as string
    }
    if (!idToken || !target) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days in ms
        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn,
        })

        const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
        const cookieHeader = `session=${sessionCookie}; Path=/; HttpOnly; ${secure}Max-Age=${expiresIn / 1000}; SameSite=Lax`

        return new Response(JSON.stringify({ success: true, target }), {
            status: 200,
            headers: {
                'Set-Cookie': cookieHeader,
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        logWarning('Session login error', error)

        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
