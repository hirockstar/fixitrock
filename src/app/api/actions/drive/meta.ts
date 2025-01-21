'use server'

import { logWarning } from '®/lib/utils'
import { DriveClient } from '®/lib/utils/DriveClient'

export async function getMeta(meta: string) {
    const client = await DriveClient()

    if (!client) {
        throw new Error('DriveClient initialization failed')
    }

    try {
        const response = await client
            .api(`/me/drive/root:/RDRIVE/${meta}`)
            .select('id,name,size,folder,lastModifiedDateTime')
            .get()

        let thumbnails = null

        if (response?.id) {
            try {
                const thumbnailResponse = await client
                    .api(`/me/drive/items/${response.id}:/icon.png`)
                    .expand('thumbnails')
                    .get()
                thumbnails = thumbnailResponse?.thumbnails || null
            } catch (error: unknown) {
                if (
                    error instanceof Error &&
                    (error as { statusCode?: number }).statusCode === 404
                ) {
                    // Log as non-critical when thumbnail is missing
                    logWarning(`Thumbnails not found for item ${response.id}.`)
                } else {
                    // Log and rethrow unexpected errors
                    logWarning(
                        `Unexpected error while fetching thumbnails for item ${response.id}:`,
                        error instanceof Error ? error.message : error
                    )
                }
            }
        }

        return {
            ...response,
            thumbnails,
        }
    } catch (error: unknown) {
        logWarning(
            `Failed to fetch metadata for ${meta} from OneDrive (getMeta):`,
            error instanceof Error ? error.message : error
        )
        return {}
    }
}
