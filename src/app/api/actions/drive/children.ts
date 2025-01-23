'use server'

import useHidden from '®/hooks/useHidden'
import { logWarning } from '®/lib/utils'
import { DriveClient } from '®/lib/utils/DriveClient'
import { DriveItem } from '®/types/drive'

export async function getChildren(slug: string, top: number = 55, skipToken?: string) {
    const client = await DriveClient()

    if (!client) {
        throw new Error('DriveClient initialization failed')
    }

    try {
        let url = `/me/drive/root:/RDRIVE${slug}:/children`

        url += `?top=${top}`
        if (skipToken) {
            url += `&$skiptoken=${skipToken}`
        }
        const response = await client.api(url).expand('thumbnails($select=large)').get()

        let readme: DriveItem | null = null

        const value = response.value
            ? await Promise.all(
                  response.value.map(async (child: DriveItem) => {
                      try {
                          if (child.name.toLowerCase() === 'readme.md') {
                              const details = await client
                                  .api(`/me/drive/items/${child.id}`)
                                  .select('@microsoft.graph.downloadUrl')
                                  .get()

                              readme = {
                                  ...child,
                                  '@microsoft.graph.downloadUrl':
                                      details['@microsoft.graph.downloadUrl'],
                              }

                              return null
                          }

                          if (useHidden(child)) return null

                          let thumbnails: DriveItem['thumbnails'] | null = null

                          if (child.folder) {
                              try {
                                  const thumbnailResponse = await client
                                      .api(`/me/drive/items/${child.id}:/icon.png`)
                                      .expand('thumbnails($select=large)')
                                      .get()

                                  thumbnails = thumbnailResponse.thumbnails || null
                              } catch (error: unknown) {
                                  if (
                                      error instanceof Error &&
                                      (error as { statusCode?: number }).statusCode === 404
                                  ) {
                                      logWarning(`Thumbnail not found for folder ${child.id}`)
                                  } else {
                                      throw error
                                  }
                              }
                          }

                          return {
                              ...child,
                              thumbnails:
                                  thumbnails ||
                                  (child.thumbnails?.length ? child.thumbnails : null),
                          }
                      } catch (error: unknown) {
                          if (error instanceof Error) {
                              logWarning(
                                  `Failed to process child item (${child.name}): ${error.message}`
                              )
                          }

                          return null
                      }
                  })
              )
            : []

        return { ...response, value: value.filter(Boolean), readme }
    } catch (error: unknown) {
        if (error instanceof Error) {
            logWarning('Failed to fetch metadata from OneDrive (getChildren):', error.message)
        } else {
            logWarning('An unknown error occurred in getChildren.')
        }

        return {}
    }
}
