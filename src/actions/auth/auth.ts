'use server'

import { cookies } from 'next/headers'

import { adminAuth } from '®firebase/admin'
import { logWarning } from '®lib/utils'
import { createClient } from '®supabase/server'

/**
 * Verifies Firebase ID token and returns the decoded phone number.
 */
async function getPhoneFromIdToken(token: string) {
    try {
        const decoded = await adminAuth.verifyIdToken(token)

        return decoded.phone_number || null
    } catch {
        return null
    }
}

/**
 * Saves new user to Supabase or returns existing one. Returns isNew flag.
 */
export async function verifyAndSaveUser(
    idToken: string,
    userDetails?: { name: string; username: string }
) {
    try {
        const phone = await getPhoneFromIdToken(idToken)

        if (!phone) throw new Error('Phone number not found in token')

        const supabase = await createClient()

        const { data: existing } = await supabase
            .from('users')
            .select('*')
            .eq('phone', phone)
            .single()

        if (existing) return { user: existing, isNew: false }

        if (!userDetails) return { user: null, isNew: true }

        const { data, error } = await supabase
            .from('users')
            .insert({
                phone,
                name: userDetails.name,
                username: userDetails.username,
            })
            .select()
            .single()

        if (error) throw error

        return { user: data, isNew: true }
    } catch (err) {
        return { error: (err as Error).message }
    }
}

/**
 * Retrieves user from Supabase using Firebase session cookie.
 */
export async function getUserSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('firebase_id_token')?.value

    if (!token) return null

    const phone = await getPhoneFromIdToken(token)

    if (!phone) return null

    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select('*').eq('phone', phone).single()

    return error ? null : data
}

/**
 * Signs the user out (revokes session & clears cookie).
 */
export async function revokeUserSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('firebase_id_token')?.value

    if (token) {
        try {
            const decoded = await adminAuth.verifyIdToken(token)

            await adminAuth.revokeRefreshTokens(decoded.uid)
        } catch (err) {
            logWarning('Failed to revoke Firebase token:', err)
        }
    }

    cookieStore.set('firebase_id_token', '', { path: '/', maxAge: 0 })
}

/**
 * Check if a username is available
 */
export async function checkUsernameAvailable(username: string) {
    const supabase = await createClient()

    const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('username', username)

    return count === 0
}
