'use server'

import useHidden from '®/hooks/useHidden'
import { logWarning } from '®/lib/utils'
import { DriveClient } from '®/lib/utils/DriveClient'
import { DriveItem } from '®/types/drive'

export async function getChildren(slug: string) {
    const client = await DriveClient()

    if (!client) {
        throw new Error('DriveClient initialization failed')
    }

    try {
        const response = await client
            .api(`/me/drive/root:/RDRIVE/${slug}`)
            .select('id,name,lastModifiedDateTime')
            .expand('children($expand=thumbnails)')
            .get()

        let readme: DriveItem | null = null

        const children = response.children
            ? await Promise.all(
                  response.children.map(async (child: DriveItem) => {
                      try {
                          // Handle README files
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

                          // Filter hidden items
                          if (useHidden(child)) return null

                          // Handle thumbnails for folders
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
                                      // Log only if necessary for debugging
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

        return { ...response, children: children.filter(Boolean), readme }
    } catch (error: unknown) {
        if (error instanceof Error) {
            logWarning('Failed to fetch metadata from OneDrive (getChildren):', error.message)
        } else {
            logWarning('An unknown error occurred in getChildren.')
        }
        return {}
    }
}
