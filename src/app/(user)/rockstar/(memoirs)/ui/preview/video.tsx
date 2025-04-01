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
        <div className='flex'>
            {!isIframeLoaded && <Skeleton className='aspect-video w-full' />}
            {hiddenIframe}
            {isIframeLoaded && data && (
                <iframe
                    allowFullScreen
                    className={`h-${file.video.height} w-full border`}
                    src={`https://fixitrock-my.sharepoint.com/personal/drive_fixitrock_com/_layouts/15/embed.aspx?UniqueId=${extractUniqueId(file['@microsoft.graph.downloadUrl'] || '')}&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create`}
                />
            )}
        </div>
    )
}
