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

    // Utility to sanitize the search query
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
            .get()

        const searchResults = response?.value || []
        if (!searchResults.length) return { data: [] } // Return empty data array if no results

        // Process each search result and return them as SearchItem objects
        const items = await Promise.all(
            searchResults.map(async (item: SearchItem) => {
                if (useHidden(item)) return null

                try {
                    const itemDetails = await client
                        .api(`/me/drive/items/${item.id}`)
                        .select('id,name,size,folder,lastModifiedDateTime,parentReference')
                        .expand('thumbnails($select=large)')
                        .get()

                    // Handle folders and thumbnails
                    if (itemDetails.folder) {
                        try {
                            const thumbnailResponse = await client
                                .api(`/me/drive/items/${item.id}:/icon.png`)
                                .expand('thumbnails($select=large)')
                                .get()
                            itemDetails.thumbnails =
                                thumbnailResponse?.thumbnails || itemDetails.thumbnails || null
                        } catch {
                            itemDetails.thumbnails = itemDetails.thumbnails || null // Fallback
                        }
                    }

                    return itemDetails
                } catch (error: unknown) {
                    logWarning(
                        `Failed to fetch details for item ${item.id}:`,
                        error instanceof Error ? error.message : error
                    )
                    return null
                }
            })
        )

        // Return the items in the format that matches the Search interface
        return { data: items.filter(Boolean) } // Wrap in 'data' field
    } catch (error: unknown) {
        logWarning(
            'Error searching items in OneDrive (getMeta):',
            error instanceof Error ? error.message : error
        )
        return { data: [] } // Return empty data array in case of error
    }
}
