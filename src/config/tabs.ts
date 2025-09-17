'use client'

import { useDownloadStore } from '@/zustand/store'

export const tabConfigs = [
    {
        key: 'actions',
        title: 'Shortcuts',
        icon: 'pajamas:suggestion-ai',
        shouldFilter: true,
        visible: () => true,
    },
    {
        key: 'space',
        title: 'Space',
        icon: 'fluent:phone-link-setup-24-regular',
        shouldFilter: false,
        visible: () => true,
    },
    {
        key: 'downloads',
        title: 'Downloads',
        icon: 'fluent:arrow-download-24-regular',
        shouldFilter: true,
        visible: () => useDownloadStore.getState().hasDownloads(),
    },
]
export const tabs = tabConfigs.filter((t) => t.visible())
