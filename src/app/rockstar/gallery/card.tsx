'use client'
import { Card, Image } from '@heroui/react'
import { useRouter } from 'nextjs-toploader/app'

import { formatDateTime } from '®/lib/utils'
import { GalleryProps } from '®/types/user'

export default function GalleryCard({ c }: { c: GalleryProps }) {
    const router = useRouter()

    return (
        <Card
            key={c.name}
            isPressable
            aria-label={c.name}
            className='w-full select-none rounded-lg border bg-transparent'
            shadow='none'
            onPress={() => router.push(`/rockstar/gallery/${Path(c.name)}`)}
        >
            <Image
                alt={c.name}
                className='h-[160px] w-full object-cover object-center sm:h-[200px] lg:h-[200px]'
                classNames={{ wrapper: '!max-w-full' }}
                src={c.thumbnail}
            />
            <div className='absolute bottom-0 z-20 flex w-full justify-between bg-black bg-opacity-20 p-1 px-2 text-xs text-white'>
                <p className='w-24 truncate text-start sm:w-auto'>{Name(c.name)} </p>
                <p className='text-xs'>{formatDateTime(Date(c.name))}</p>
            </div>
        </Card>
    )
}

export function Name(name: string) {
    return name.replace(/^\d{4}-\d{2}-\d{2}-|\.[^.]+$/g, '')
}

export function Date(date: string) {
    const match = date.match(/^\d{4}-\d{2}-\d{2}/)

    return match ? match[0] : ''
}

export function Path(name: string) {
    return name.replace(/\.[^.]+$/, '')
}
