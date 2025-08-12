'use server'

import type { User } from '@/app/login/types'

import { createClient } from '@/supabase/server'

export async function createUser(profile: Partial<User>): Promise<{ user?: User; error?: string }> {
    const supabase = await createClient()

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()

    if (claimsError || !claimsData?.claims) {
        return { error: 'Not authenticated' }
    }

    const { id, phone_number: phone } = claimsData.claims

    const { data, error } = await supabase
        .from('users')
        .insert({
            id,
            phone,
            ...profile,
        })
        .select()
        .single()

    if (error) return { error: error.message }

    return { user: data }
}
