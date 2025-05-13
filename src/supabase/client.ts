import { createBrowserClient } from '@supabase/ssr'

import { env } from '®lib/env'

export const createClient = () => {
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL and Anon Key must be set in environment variables.')
    }
    return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
