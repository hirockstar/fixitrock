'use client'

import { useRouter } from 'next/navigation'

import { getDownloadUrl, isFolder, isPreviewable } from '@/lib/utils'
import { DriveItem } from '@/types/drive'

import { getHref } from '../utils'

export function useSelectItem(
    setSelectedItem?: (item: DriveItem) => void,
    setPreviewOpen?: (open: boolean) => void
) {
    const router = useRouter()

    return (item: DriveItem) => {
        setSelectedItem?.(item)

        if (isFolder(item)) {
            router.push(getHref(item))
        } else if (isPreviewable(item)) {
            router.push(getHref(item), { scroll: false })
            setPreviewOpen?.(true)
        } else {
            const downloadUrl = getDownloadUrl(item)

            if (downloadUrl) window.location.href = downloadUrl
        }
    }
}
