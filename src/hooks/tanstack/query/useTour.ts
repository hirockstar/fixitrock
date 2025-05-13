'use client'

import { useQuery } from '@tanstack/react-query'

import { getTour } from '®actions/user/tour'

export function useTour(tour: string) {
    const query = useQuery({
        queryKey: ['Tour', tour],
        queryFn: () => getTour(tour),
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return { ...query }
}
