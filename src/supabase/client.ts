import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
    createBrowserClient(process.env.VERCEL_SUPABASE_URL!, process.env.VERCEL_SUPABASE_ANON_KEY!)
