'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function useTabs(defaultTab: string) {
    const router = useRouter()
    const queryParams = useSearchParams()

    const initialTab = queryParams.get('tab')

    const [tab, setSelectedTab] = useState<string>(initialTab || defaultTab)

    useEffect(() => {
        const currentTab = queryParams.get('tab')

        if (currentTab && currentTab !== tab) {
            setSelectedTab(currentTab)
        }
    }, [queryParams, tab])

    const setTab = (newTab: string) => {
        if (newTab !== tab) {
            setSelectedTab(newTab)
            router.push(`?tab=${newTab}`, { scroll: false })
        }
    }

    return { tab, setTab }
}

export default useTabs
