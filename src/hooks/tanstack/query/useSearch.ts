'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { Search } from '®types/drive'

import { getSearch } from '®actions/drive/search'

export const useSearch = (query: string) => {
    const queryClient = useQueryClient()
    const [debouncedQuery, setDebouncedQuery] = useState(query)

    useEffect(() => {
        if (query) {
            const handler = setTimeout(() => {
                setDebouncedQuery(query)
            }, 1000)

            return () => {
                clearTimeout(handler)
            }
        }
    }, [query])

    useEffect(() => {
        if (query && query !== debouncedQuery) {
            queryClient.invalidateQueries({ queryKey: ['search', query] })
        }
    }, [query, debouncedQuery, queryClient])

    return useQuery<Search>({
        queryKey: ['search', debouncedQuery],
        queryFn: () => getSearch(debouncedQuery),
        enabled: !!debouncedQuery,
        refetchOnWindowFocus: false,
    })
}
