'use server'
import { cache } from 'react'

import { NavLink } from '®app/login/types'
import { logWarning } from '®lib/utils'
import { createClient } from '®supabase/server'

export const navLinks = cache(async (role: string): Promise<NavLink[]> => {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('nav_links')
            .select('*')
            .eq('role', role)
            .eq('active', true)
            .order('sort_order', { ascending: true })

        if (error) {
            logWarning(`[Supabase nav_links error]`, error)
            throw error
        }

        // Ensure only plain objects are returned
        return data ? JSON.parse(JSON.stringify(data)) : []
    } catch (err) {
        logWarning(`[navLinks error]`, err)

        return []
    }
})
