'use client'

import { usePathname, useSearchParams } from 'next/navigation'

export function useTabs() {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const tabParam = searchParams?.get('tab')
    const tab = tabParam ? `${pathname}?tab=${tabParam}` : pathname

    return {
        tab,
    }
}
