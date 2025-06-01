'use client'

import { Listbox, ListboxItem } from '@heroui/react'
import { useRouter } from 'nextjs-toploader/app'

import { formatDateTime, formatBytes, path } from '®lib/utils'
import { Search } from '®types/drive'
import { ListSkeleton } from '®ui/skeleton'
import { SearchEmpty } from '®ui/state'

export function DriveItem({
    data,
    isLoading,
    setOpen,
    query,
}: {
    data: Search | undefined
    isLoading: boolean
    setOpen: (open: boolean) => void
    query: string
}) {
    const router = useRouter()
    const handleRoute = (command: () => void) => {
        setOpen(false)
        command()
    }

    if (isLoading) {
        return (
            <div className='flex flex-col gap-1.5 px-1.5 py-1.5'>
                <ListSkeleton />
            </div>
        )
    }

    if (data && data.value.length === 0) {
        return <SearchEmpty query={query} />
    }

    if (!data || !data.value.length) {
        return null
    }

    return (
        <Listbox
            autoFocus
            aria-label='Drive Search Result'
            classNames={{ list: 'gap-1.5 px-0.5 py-1' }}
        >
            {data.value.map((c) => (
                <ListboxItem
                    key={c.id}
                    className='data-[hover=true]:bg-muted/50 overflow-hidden border'
                    startContent={''}
                    textValue={c.name}
                    onPress={() => handleRoute(() => router.push(path(c.webUrl, !!c.file)))}
                >
                    <div className='flex flex-col'>
                        <h2 className='truncate text-[13px]'>{c.name}</h2>
                        <p className='text-muted-foreground items-center text-xs'>
                            {[
                                c?.file && c?.size && formatBytes(c.size),
                                c?.lastModifiedDateTime && formatDateTime(c?.lastModifiedDateTime),
                            ]
                                .filter(Boolean)
                                .map((item, index, arr) => (
                                    <span key={index}>
                                        {item}
                                        {index < arr.length - 1 && <span className='mx-2'>•</span>}
                                    </span>
                                ))}
                        </p>
                    </div>
                </ListboxItem>
            ))}
        </Listbox>
    )
}
