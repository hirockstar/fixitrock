'use server'

import { cookies } from 'next/headers'
import { cache } from 'react'

import { getNavigation } from '®actions/supabase'
import { Navigation, User } from '®app/login/types'
import { adminAuth } from '®firebase/admin'
import { createClient } from '®supabase/server'

// Helper function to get current authenticated user

export const userSession = cache(async function userSession(): Promise<{
    user: User | null
    navigation: Navigation[]
}> {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) return { user: null, navigation: [] }

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
            return { user: null, navigation: [] }
        }

        const navFromDb = user.role ? await getNavigation(user.role) : []

        // Always include profile as the first navigation item
        const navigation: Navigation[] = [
            {
                href: `/@${user.username}`,
                icon: 'Activity',
                title: 'Activity',
                description: 'Go to your profile',
            },
            ...navFromDb.map((item) => ({
                ...item,
                href: `/@${user.username}/${item.href.replace(/^\/+/, '')}`,
            })),
        ]

        return { user: user as User, navigation }
    } catch {
        throw new Error('Authentication failed')
    }
})
