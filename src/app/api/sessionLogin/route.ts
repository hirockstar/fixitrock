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
        return new Response('Invalid request', { status: 400 })
    }

    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days in ms
        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn,
        })

        const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
        const cookieHeader = `session=${sessionCookie}; Path=/; HttpOnly; ${secure}Max-Age=${expiresIn / 1000}; SameSite=Lax`

        // Return HTML with JS redirect
        const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${target}"><script>window.location.replace('${target}')</script></head><body>Redirecting...</body></html>`

        return new Response(html, {
            status: 200,
            headers: {
                'Set-Cookie': cookieHeader,
                'Content-Type': 'text/html',
            },
        })
    } catch (error) {
        logWarning('Session login error', error)

        return new Response('Unauthorized', { status: 401 })
    }
}
