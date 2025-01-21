'use client'

import { useQuery } from '@tanstack/react-query'
import { getStorage, StorageData } from '®actions/drive/storage'

export function useStorage() {
    const query = useQuery<StorageData, Error>({
        queryKey: ['Status'],
        queryFn: getStorage,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })

    const defaultData: StorageData = {
        storage: {
            remaining: 0,
            state: 'server',
            total: 0,
            used: 0,
        },
        folders: [],
    }

    return { ...query, data: query.data || defaultData }
}
