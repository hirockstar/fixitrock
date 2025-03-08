'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function useTabs(tab: string) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get('tab') || tab
    const [selectedTab, setSelectedTab] = useState(currentTab)

    useEffect(() => {
        setSelectedTab(currentTab)
    }, [currentTab])

    const setTab = (tab: string) => {
        setSelectedTab(tab)
        router.push(`?tab=${tab}`, { scroll: false })
    }

    return { selectedTab, setTab }
}

export default useTabs
