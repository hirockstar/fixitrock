'use server'

import { cache } from 'react'

import { getNavigation } from '®actions/supabase'
import { Navigation, User } from '®app/login/types'
import { createClient } from '®supabase/server'

export const userSession = cache(async function userSession(): Promise<{
    user: User | null
    navigation: Navigation[]
}> {
    const supabase = await createClient()
    const { data, error: claimsError } = await supabase.auth.getClaims()
    const claims = data?.claims

    if (claimsError || !claims?.sub) return { user: null, navigation: [] }

    const id = claims.sub

    const { data: user, error } = await supabase.from('users').select('*').eq('id', id).single()

    if (error || !user) {
        return { user: null, navigation: [] }
    }

    const navFromDb = user.role ? await getNavigation(user.role) : []

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
