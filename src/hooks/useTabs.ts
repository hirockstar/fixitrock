'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useSearchParams } from './useSearchParams'

function useTabs(tabs: string) {
    const router = useRouter()
    const queryParams = useSearchParams()
    const [tab, setSelectedTab] = useState(tabs)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    useEffect(() => {
        if (hasMounted) {
            const currentTab = queryParams?.get('tab') || tabs

            setSelectedTab(currentTab)
        }
    }, [hasMounted, queryParams, tabs])

    const setTab = (tab: string) => {
        setSelectedTab(tab)
        router.push(`?tab=${tab}`, { scroll: false })
    }

    return { tab, setTab, hasMounted }
}

export default useTabs
