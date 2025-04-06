// src/lib/env.ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        API_SECRET_KEY: z
            .string()
            .min(1, 'API_SECRET_KEY cannot be empty')
            .refine((str) => str.length >= 5, {
                message: 'API_SECRET_KEY must be at least 5 characters long',
            }),
        HIDDEN: z.string().default('default value'),
        SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY cannot be empty'),
        SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
    },
    client: {
        NEXT_PUBLIC_SITE_URL: z
            .string()
            .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
            .min(1, 'NEXT_PUBLIC_SITE_URL cannot be empty'),

        NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),

        NEXT_PUBLIC_SUPABASE_ANON_KEY: z
            .string()
            .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty'),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
})
