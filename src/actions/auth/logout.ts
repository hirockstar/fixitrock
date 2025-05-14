// actions/logout.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { adminAuth } from '®lib/firebaseAdmin'
import { logWarning } from '®lib/utils'

export async function logout() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value

    if (sessionCookie) {
        try {
            const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)

            await adminAuth.revokeRefreshTokens(decodedClaims.sub)
        } catch (err) {
            logWarning('Failed to revoke Firebase session:', err)
        }
    }

    cookieStore.set({ name: 'session', value: '', path: '/', maxAge: 0, httpOnly: true })
    cookieStore.set({ name: 'username', value: '', path: '/', maxAge: 0 })

    redirect('/')
}
