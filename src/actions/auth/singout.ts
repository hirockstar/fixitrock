'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Signs out the current user by clearing the session cookie.
 *
 * Note: For multi-tab logout, you should also set localStorage 'signout' on the client:
 * window.localStorage.setItem('signout', Date.now().toString())
 * and listen for it in other tabs to trigger logout and redirect.
 */
export async function signOut() {
    const cookieStore = await cookies()

    cookieStore.set('session', '', { path: '/', maxAge: 0 })
    // After sign out, redirect to home
    redirect('/')
}
