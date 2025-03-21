'use client'

import { useState, useEffect } from 'react'
import { usePathname, useSearchParams as useNextSearchParams } from 'next/navigation'

/**
 * Custom hook to get URL search params that update when the URL changes.
 */
export function useSearchParams() {
    const nextSearchParams = useNextSearchParams()
    const pathname = usePathname() // Ensure reactivity to route changes
    const [queryParams, setQueryParams] = useState(
        () => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    )

    useEffect(() => {
        setQueryParams(new URLSearchParams(window.location.search))
    }, [nextSearchParams, pathname]) // Update when URL changes

    return queryParams
}
