'use client'

import { Listbox, ListboxItem } from '@heroui/react'
import { useRouter } from 'nextjs-toploader/app'
import { formatCount, formatDateTime, formatBytes } from '®/lib/utils'
import { Search } from '®/types/drive'
import { ListSkeleton } from '®/ui/skeleton'
import { SearchEmpty } from '®/ui/state'
import { Thumbnail } from '../drive/thumbnail'

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
    const url = (path: string, name: string, isFolder: boolean): string => {
        const basePath = path.replace('/drive/root:/RDRIVE', '')
        return isFolder ? `${basePath}/${name}` : `${basePath}#${name}`
    }
    const router = useRouter()
    const handleRoute = (command: () => void) => {
        setOpen(false)
        command()
    }
    if (isLoading) {
        return (
            <div className='px-1.5 py-1.5'>
                <ListSkeleton />
            </div>
        )
    }

    if (data && data.data.length === 0) {
        return <SearchEmpty query={query} />
    }

    if (!data || !data.data.length) {
        return null
    }

    return (
        <Listbox
            aria-label='Drive Search Result'
            classNames={{ list: 'gap-1.5 px-1 py-1.5' }}
            autoFocus
        >
            {data.data.map((c) => (
                <ListboxItem
                    key={c.id}
                    textValue={c.name}
                    onPress={() =>
                        handleRoute(() =>
                            router.push(url(c?.parentReference.path, c.name, !!c.folder))
                        )
                    }
                    className='overflow-hidden border data-[hover=true]:bg-muted/50'
                    startContent={
                        <Thumbnail type='List' src={c?.thumbnails?.[0]?.large?.url} name={c.name} />
                    }
                >
                    <div className='flex flex-col'>
                        <h2 className='line-clamp-1 text-[15px] font-medium'>{c.name}</h2>
                        <p className='text-xs text-muted-foreground'>
                            {[
                                formatBytes(c?.size),
                                c?.folder?.childCount && formatCount(c.folder.childCount),
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
