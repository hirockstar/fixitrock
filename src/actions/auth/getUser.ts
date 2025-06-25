'use server'

import { cache } from 'react'

import { createClient } from '®supabase/server'
import { User } from '®app/login/types'

export const getUser = cache(async (username: string): Promise<User | null> => {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single()

        if (error || !data) return null

        return data as User
    } catch {
        // Optionally log error
        return null
    }
})
