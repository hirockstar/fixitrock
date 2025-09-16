'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useSearchStore } from '@/zustand/store'

export default function SearchPage() {
    const setOpen = useSearchStore((s) => s.setOpen)
    const open = useSearchStore((s) => s.open)
    const router = useRouter()

    useEffect(() => {
        setOpen(true)

        return () => setOpen(false)
    }, [setOpen])

    useEffect(() => {
        if (!open) {
            router.push('/')
        }
    }, [open, router])

    return null
}
