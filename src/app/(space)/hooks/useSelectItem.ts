'use client'

import { useRouter } from 'next/navigation'

import { isFolder, isPreviewable } from '@/lib/utils'
import { DriveItem } from '@/types/drive'
import { useDownload } from '@/hooks/useDownload'
import { useDownloadStore } from '@/zustand/store/download'

import { getHref } from '../utils'

export function useSelectItem(
    setSelectedItem?: (item: DriveItem) => void,
    setPreviewOpen?: (open: boolean) => void
) {
    const router = useRouter()
    const { downloadFile, pauseDownload, resumeDownload } = useDownload()
    const { downloads } = useDownloadStore()

    return (item: DriveItem) => {
        setSelectedItem?.(item)

        if (isFolder(item)) {
            router.push(getHref(item))
        } else if (isPreviewable(item)) {
            router.push(getHref(item), { scroll: false })
            setPreviewOpen?.(true)
        } else {
            const download = downloads.get(item.id)

            if (!download) {
                downloadFile(item)
            } else if (download.status === 'downloading') {
                pauseDownload(item.id)
            } else if (download.status === 'paused') {
                resumeDownload(download)
            } else {
                downloadFile(item)
            }
        }
    }
}
