import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

import { createClient } from '®supabase/client'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user))
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => listener.subscription.unsubscribe()
    }, [supabase])

    return { user }
}
