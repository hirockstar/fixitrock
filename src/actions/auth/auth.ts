'use server'

import { cookies } from 'next/headers'

import { adminAuth } from '®firebase/admin'
import { createClient } from '®supabase/server'

/**
 * Returns the current logged-in user from Supabase using Firebase session cookie.
 */
export async function userSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) return null
    try {
        const decoded = await adminAuth.verifyIdToken(token)
        const uid = decoded.uid
        const supabase = await createClient()
        const { data, error } = await supabase.from('users').select('*').eq('id', uid).single()

        return error ? null : data
    } catch {
        return null
    }
}

/**
 * Checks if a username is available.
 */
export async function checkUsername(username: string) {
    const supabase = await createClient()
    const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('username', username)

    return count === 0
}

/**
 * Starts a session by verifying Firebase ID token and setting a secure cookie. Returns if user is new.
 */
export async function startSession(idToken: string) {
    try {
        const decoded = await adminAuth.verifyIdToken(idToken)
        const uid = decoded.uid
        const phone = decoded.phone_number

        if (!uid || !phone) throw new Error('Invalid token')
        const cookieStore = await cookies()

        cookieStore.set('session', idToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
        })
        const supabase = await createClient()
        const { data: existing } = await supabase.from('users').select('id').eq('id', uid).single()

        return { isNew: !existing, uid, phone }
    } catch (err) {
        return { error: (err as Error).message }
    }
}

/**
 * Creates a new user in Supabase using Firebase UID as id. Only allowed if session is valid.
 */
export async function createUser(user: {
    name: string
    username: string
    gender: string
    dob?: string | null
}) {
    try {
        const cookieStore = await cookies()
        const idToken = cookieStore.get('session')?.value

        if (!idToken) throw new Error('Not authenticated')
        const decoded = await adminAuth.verifyIdToken(idToken)
        const uid = decoded.uid
        const phone = decoded.phone_number

        if (!uid || !phone) throw new Error('Invalid session')
        const supabase = await createClient()
        const { data: existing } = await supabase.from('users').select('id').eq('id', uid).single()

        if (existing) return { user: existing, isNew: false }
        const { data, error } = await supabase
            .from('users')
            .insert({
                id: uid,
                phone,
                name: user.name,
                username: user.username,
                gender: user.gender,
                dob: user.dob,
                active: true,
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
 * Signs out the current user by clearing the session cookie.
 */
export async function signOut() {
    const cookieStore = await cookies()

    cookieStore.set('session', '', { path: '/', maxAge: 0 })
}
