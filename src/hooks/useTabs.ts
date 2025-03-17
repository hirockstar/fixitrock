'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function useTabs(defaultTab: string) {
    const router = useRouter()
    const queryParams = useSearchParams()
    const [tab, setSelectedTab] = useState(defaultTab)

    useEffect(() => {
        if (queryParams) {
            const currentTab = queryParams.get('tab') || defaultTab

            setSelectedTab(currentTab)
        }
    }, [queryParams, defaultTab]) // Re-run if queryParams or defaultTab change

    const setTab = (tab: string) => {
        setSelectedTab(tab)
        router.push(`?tab=${tab}`, { scroll: false })
    }

    return { tab, setTab }
}

export default useTabs
