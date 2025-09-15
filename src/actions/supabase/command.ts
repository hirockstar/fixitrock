'use server'

import { cache } from 'react'

import { createClient } from '@/supabase/server'
import { Group } from '@/components/search/quick'

export const getCommand = cache(async (id: number): Promise<Group[] | null> => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('roles').select('command').eq('id', id).single()

    if (error) {
        throw new Error(error.message)
    }

    return (data?.command as Group[]) || null
})
