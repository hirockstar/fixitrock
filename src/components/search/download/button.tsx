'use client'

import { Badge, Button } from '@heroui/react'
import { ArrowDownToLine } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useDownloadStore, useSearchStore } from '@/zustand/store'
import { useDownloadWarning } from '@/hooks/useDownloadWarning'

export function Download() {
    useDownloadWarning()
    const { badge, hasDownloads } = useDownloadStore()
    const { open, setOpen, setTab } = useSearchStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])
    React.useEffect(() => {
        if (!hasDownloads()) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'j' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                setTab('downloads')
                if (!open) setOpen(true)
            }
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open, setOpen, setTab, hasDownloads])

    if (!mounted) {
        return null
    }

    if (!hasDownloads()) {
        return null
    }

    return (
        <Badge
            isOneChar
            className='size-3 min-h-0 min-w-0'
            color='success'
            isInvisible={!badge()}
            shape='circle'
            size='sm'
        >
            <Button
                isIconOnly
                className='bg-default/20'
                radius='full'
                size='sm'
                startContent={<ArrowDownToLine size={18} />}
                variant='light'
                onPress={() => {
                    setTab('downloads')
                    if (!open) setOpen(true)
                }}
            />
        </Badge>
    )
}
