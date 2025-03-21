'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function useTabs(tabs: string) {
    const router = useRouter()
    const queryParams = useSearchParams()
    const [tab, setSelectedTab] = useState(tabs)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        // This ensures the code runs only on the client side after mounting
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
