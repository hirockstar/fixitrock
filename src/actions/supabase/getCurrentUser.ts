'use server'

import { cookies } from 'next/headers'

import { adminAuth } from '®firebase/admin'
import { createClient } from '®supabase/server'

// Helper function to get current authenticated user

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
        throw new Error('Not authenticated')
    }

    try {
        const decoded = await adminAuth.verifyIdToken(token)
        const uid = decoded.uid

        const supabase = await createClient()
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', uid)
            .single()

        if (error || !user) {
            throw new Error('User not found')
        }

        return user
    } catch {
        throw new Error('Authentication failed')
    }
}
