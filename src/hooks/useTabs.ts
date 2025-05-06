'use client'

import { usePathname } from 'next/navigation'

import { useSearchParams } from './useSearchParams'

export function useTabs() {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const tabParam = searchParams?.get('tab')
    const tab = tabParam ? `${pathname}?tab=${tabParam}` : pathname

    return {
        tab,
    }
}
