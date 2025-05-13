'use client'

import { Skeleton } from '@heroui/react'

import { DriveItem } from '®/types/drive'
import { useLink } from '®hooks/tanstack/query/useLink'

function extractUniqueId(url: string) {
    const regex = /UniqueId=([a-f0-9\-]+)/i
    const match = url.match(regex)

    return match ? match[1] : null
}

export function VideoPreview({ file }: { file: DriveItem }) {
    const { data, isIframeLoaded, hiddenIframe } = useLink(file.id)

    return (
        <>
            {!isIframeLoaded && (
                <Skeleton className='aspect-video w-full overflow-hidden rounded-sm sm:h-full' />
            )}
            {hiddenIframe}
            {isIframeLoaded && data && (
                <iframe
                    allowFullScreen
                    className={`aspect-video w-full overflow-hidden rounded-sm sm:h-full`}
                    src={`https://fixitrock-my.sharepoint.com/personal/ftp_fixitrock_com/_layouts/15/embed.aspx?UniqueId=${extractUniqueId(file['@microsoft.graph.downloadUrl'] || '')}&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create`}
                />
            )}
        </>
    )
}
