'use client'

import { useQuery } from '@tanstack/react-query'

import { getGallery } from '®/server/actions/user/gallery'

export function useGallery(username: string) {
    const query = useQuery({
        queryKey: ['Tour', username],
        queryFn: () => getGallery(username),
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return { ...query }
}
