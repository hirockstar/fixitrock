'use server'

import type { User } from '®app/login/types'

import { createClient } from '®supabase/server'

export async function createUser(profile: Partial<User>): Promise<{ user?: User; error?: string }> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }
    const { data, error } = await supabase
        .from('users')
        .insert({
            id: user.id,
            phone: user.phone,
            ...profile,
        })
        .select()
        .single()

    if (error) return { error: error.message }

    return { user: data }
}
