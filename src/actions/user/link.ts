'use server'

import { logWarning } from '®lib/utils'
import { DriveClient } from '®lib/utils/DriveClient'
import { DriveLink } from '®types/drive'

export async function getLink(id: string): Promise<DriveLink> {
    const client = await DriveClient()

    if (!client) throw new Error('DriveClient initialization failed')

    try {
        const response = await client.api(`/me/drive/items/${id}/createLink`).post({
            type: 'view',
            scope: 'anonymous',
        })

        if (!response) {
            throw new Error('404: Item not found')
        }

        return response as DriveLink
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)

        if (message.includes('404')) {
            throw new Error('404: Item not found')
        }

        logWarning(`Failed to fetch drive item for ID ${id}:`, message)
        throw new Error('Failed to fetch drive item')
    }
}
