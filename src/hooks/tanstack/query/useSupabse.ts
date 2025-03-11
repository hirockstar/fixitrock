'use client'

import { useQuery } from '@tanstack/react-query'

import { getData } from '®/server/supabase/getData'

export function useSupabse(table: string) {
    const query = useQuery({
        queryKey: [table],
        queryFn: async () => {
            const data = await getData(table)

            return data.reverse()
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return { ...query }
}
