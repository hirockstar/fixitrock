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

        if (currentTab) {
            setSelectedTab(currentTab)
        }
    }, [queryParams])

    const setTab = (newTab: string) => {
        setSelectedTab(newTab)

        if (newTab === defaultTab && !queryParams.get('tab')) return

        router.push(`?tab=${newTab}`, { scroll: false })
    }

    return { tab, setTab }
}

export default useTabs
