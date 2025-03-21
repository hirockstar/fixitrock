'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function useTabs(tabs: string) {
    const router = useRouter()
    const queryParams = useSearchParams()
    const currentTab = queryParams?.get('tab') || tabs
    const [tab, setSelectedTab] = useState(currentTab)

    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    useEffect(() => {
        setSelectedTab(currentTab)
    }, [currentTab])

    const setTab = (tab: string) => {
        setSelectedTab(tab)
        router.push(`?tab=${tab}`, { scroll: false })
    }

    return { tab, setTab, hasMounted }
}

export default useTabs
