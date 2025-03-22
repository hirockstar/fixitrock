'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import { getMemoirs } from '®actions/user'

export function useMemoirs(slug: string) {
    const { ref, inView } = useInView()

    const query = useInfiniteQuery({
        queryKey: ['Memoirs', slug],
        queryFn: async ({ pageParam }) => {
            const response = await getMemoirs(slug, pageParam)

            return response
        },
        initialPageParam: '',
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => lastPage['@odata.nextLink'] || undefined,
    })

    useEffect(() => {
        if (inView && query.hasNextPage) query.fetchNextPage()
    }, [inView, query.hasNextPage, query.fetchNextPage])

    const data = useMemo(() => query.data?.pages.flatMap((page) => page.value) || [], [query.data])

    return { ...query, ref, data }
}
