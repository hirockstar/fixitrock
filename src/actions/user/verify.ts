'use server'

import type { User } from '®app/login/types'

import { createClient } from '®supabase/server'

export async function verifyOtp(
    phone: string,
    otp: string
): Promise<{ user?: User; error?: string }> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
    })

    if (error) return { error: error.message }
    if (!data.user) return { error: 'No user returned from Supabase.' }
    // Fetch user profile if exists
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

    return { user: profile }
}
