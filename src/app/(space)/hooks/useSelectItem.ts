'use client'

import { useRouter as useTopLoaderRouter } from 'nextjs-toploader/app'
import { useRouter as useNextRouter } from 'next/navigation'

import { getDownloadUrl, isFolder, isPreviewable } from '®lib/utils'
import { DriveItem } from '®types/drive'

import { getHref } from '../utils'

export function useSelectItem(
    setSelectedItem?: (item: DriveItem) => void,
    setPreviewOpen?: (open: boolean) => void
) {
    const router = useNextRouter()
    const topLoader = useTopLoaderRouter()

    return (item: DriveItem) => {
        setSelectedItem?.(item)

        if (isFolder(item)) {
            router.push(getHref(item))
        } else if (isPreviewable(item)) {
            topLoader.push(getHref(item), { scroll: false })
            setPreviewOpen?.(true)
        } else {
            const downloadUrl = getDownloadUrl(item)

            if (downloadUrl) window.location.href = downloadUrl
        }
    }
}
