'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export function useTabs() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const tab = useMemo(() => {
        const tabParam = searchParams?.get('tab')

        return tabParam ? `${pathname}?tab=${tabParam}` : pathname
    }, [pathname, searchParams])

    return { tab }
}
