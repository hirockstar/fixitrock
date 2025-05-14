'use server'

import { cookies } from 'next/headers'

import { adminAuth } from '®lib/firebaseAdmin'

export async function loginSession(idToken: string, target: string) {
    if (!idToken || !target) throw new Error('Invalid session login request')

    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
    })

    ;(await cookies()).set({
        name: 'session',
        value: sessionCookie,
        path: '/',
        httpOnly: true,
        maxAge: expiresIn / 1000,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })

    if (target.startsWith('/@')) {
        const username = target.slice(2)

        ;(await cookies()).set('username', username, {
            path: '/',
            maxAge: expiresIn / 1000,
            sameSite: 'lax',
        })
    }

    return { success: true }
}
