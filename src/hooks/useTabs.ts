'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function useTabs(tabs: string) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get('tab') || tabs
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
