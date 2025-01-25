'use server'

import useHidden from '®/hooks/useHidden'
import { logWarning } from '®/lib/utils'
import { DriveClient } from '®/lib/utils/DriveClient'
import { Search, SearchItem } from '®/types/drive'

export async function getSearch(query: string): Promise<Search> {
    const client = await DriveClient()

    if (!client) {
        throw new Error('DriveClient initialization failed')
    }
    const sanitizeQuery = (query: string): string =>
        query
            .replace(/'/g, "''")
            .replace(/[<>?\/]/g, ' ')
            .trim()
            .replace(/\s+/g, ' ')

    try {
        const sanitizedQuery = sanitizeQuery(query)
        const response = await client
            .api(`/me/drive/root:/RDRIVE:/search(q='${encodeURIComponent(sanitizedQuery)}')`)
            .select('id,name,size,lastModifiedDateTime,parentReference')
            .get()

        const filteredItems = response.value.filter((c: SearchItem) => !useHidden(c))

        return { value: filteredItems }
    } catch (error: unknown) {
        logWarning('Error:', error instanceof Error ? error.message : error)

        return { value: [] }
    }
}
