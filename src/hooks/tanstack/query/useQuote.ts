'use client'

import { useQuery } from '@tanstack/react-query'

import { getData } from '®server/supabase/getData'

export function useQuote() {
    const query = useQuery({
        queryKey: ['Quotes'],
        queryFn: async () => {
            const data = await getData('quotes')

            return data.reverse()
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return { ...query }
}
