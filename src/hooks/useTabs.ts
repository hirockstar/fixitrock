'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useQueryParams } from './useQueryParams'

function useTabs(tabs: string) {
    const router = useRouter()
    const queryParams = useQueryParams()
    const currentTab = queryParams?.get('tab') || tabs
    const [tab, setSelectedTab] = useState(currentTab)

    useEffect(() => {
        setSelectedTab(currentTab)
    }, [currentTab])

    const setTab = (tab: string) => {
        setSelectedTab(tab)
        router.push(`?tab=${tab}`, { scroll: false })
    }

    return { tab, setTab }
}

export default useTabs
