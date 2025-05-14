// components/LogoutButton.tsx
'use client'

import { logout } from '®actions/auth'
import { auth } from '®lib/firebase'
import { logWarning } from '®lib/utils'

export async function useLogout() {
    try {
        await auth.signOut()
    } catch (err) {
        logWarning('Firebase signOut failed:', err)
    }

    // ✅ Then call your server action
    await logout()
}
