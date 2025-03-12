'use server'

import { siteConfig } from '®config/site'
import { logWarning } from '®lib/utils'
import { DriveClient } from '®lib/utils/DriveClient'

export async function getReadme(slug: string): Promise<string | null> {
    const client = await DriveClient()

    try {
        const res = await client
            .api(`/me/drive/root:${siteConfig.baseDirectory}${slug}/readme.md`)
            .select('@microsoft.graph.downloadUrl')
            .get()

        return res['@microsoft.graph.downloadUrl'] || null
    } catch (error: unknown) {
        if (error instanceof Error && (error as { statusCode?: number }).statusCode === 404) {
            logWarning(`No README.md found for: ${slug}`)
        } else {
            throw error
        }

        return null
    }
}
