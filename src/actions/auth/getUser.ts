'use server'

import { createClient } from '®supabase/server'

export async function getUser(username: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

    if (error || !data) return null

    return data
}
