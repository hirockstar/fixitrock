import { createBrowserClient } from '@supabase/ssr'

export const createClient = (accessToken?: string) =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            },
        }
    )
