import { createBrowserClient } from '@supabase/ssr'

import { env } from '®lib/env'

export const createClient = () => {
    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL and Anon Key must be set in environment variables.')
    }

    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
}
