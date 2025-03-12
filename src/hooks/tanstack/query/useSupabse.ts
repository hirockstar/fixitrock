'use client'

import { useQuery } from '@tanstack/react-query'

import { getData } from '®actions/supabase/getData'

export function useSupabse(table: string) {
    const query = useQuery({
        queryKey: [table],
        queryFn: async () => getData(table),
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return { ...query }
}
