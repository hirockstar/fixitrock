'use client'
import { useEffect } from 'react'

import { useSearchStore } from '@/zustand/store'

export default function SearchPage() {
    const setOpen = useSearchStore((s) => s.setOpen)

    useEffect(() => {
        setOpen(true)

        // Optionally, cleanup on unmount:
        return () => setOpen(false)
    }, [setOpen])

    return null // No need to render anything, just trigger the state
}
