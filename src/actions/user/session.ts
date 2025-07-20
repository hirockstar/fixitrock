'use server'

import { cache } from 'react'

import { getNavigation } from '®actions/supabase'
import { Navigation, User } from '®app/login/types'
import { createClient } from '®supabase/server'

// Helper function to get current authenticated user
export const userSession = cache(async function userSession(): Promise<{
    user: User | null
    navigation: Navigation[]
}> {
    const supabase = await createClient()
    const {
        data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return { user: null, navigation: [] }

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
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
})
