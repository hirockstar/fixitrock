'use server'

import { cache } from 'react'

import { getNavigation, getCommand } from '@/actions/supabase'
import { Navigation, User } from '@/app/login/types'
import { CommandType } from '@/config/navigation'
import { createClient } from '@/supabase/server'

export const userSession = cache(async function userSession(): Promise<{
    user: User | null
    navigation: Navigation[]
    command: Record<string, CommandType[]> | null
}> {
    const supabase = await createClient()
    const { data, error: claimsError } = await supabase.auth.getClaims()
    const claims = data?.claims

    if (claimsError || !claims?.sub) return { user: null, navigation: [], command: null }

    const id = claims.sub

    const { data: user, error } = await supabase.from('users').select('*').eq('id', id).single()

    if (error || !user) {
        return { user: null, navigation: [], command: null }
    }

    const navFromDb = user.role ? await getNavigation(user.role) : []
    const commandFromDb = user.role ? await getCommand(user.role) : null

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

    // Process command data to add username prefix to hrefs
    const processedCommand = commandFromDb ? Object.fromEntries(
        Object.entries(commandFromDb).map(([groupName, items]) => [
            groupName,
            items.map((item) => ({
                ...item,
                href: item.href ? `/@${user.username}/${item.href.replace(/^\/+/, '')}` : item.href,
            }))
        ])
    ) : null

    return { user: user as User, navigation, command: processedCommand }
})
