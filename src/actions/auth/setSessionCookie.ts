'use client'

import { auth } from '®lib/firebase'
import { logWarning } from '®lib/utils'

import { loginSession } from './loginSession'

export async function setSessionCookie(target: string) {
    try {
        let user = auth.currentUser
        let retries = 0

        while (!user && retries < 10) {
            await new Promise((r) => setTimeout(r, 100))
            user = auth.currentUser
            retries++
        }

        if (!user) {
            logWarning('[OTP] setSessionCookie – currentUser still null after 1 s')

            return
        }

        const idToken = await user.getIdToken(true)

        if (!target) throw new Error('No target provided for session cookie redirect')

        // ✅ call the server action instead of fetch
        await loginSession(idToken, target)

        // ✅ redirect after cookie is set
        window.location.replace(target)
    } catch (err) {
        logWarning('[OTP] setSessionCookie error', err)
    }
}
