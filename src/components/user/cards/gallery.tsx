'use client'
import { Image } from '@heroui/react'
import Link from 'next/link'

import { formatDateTime } from '®/lib/utils'
import { GalleryProps } from '®/types/user'

export default function GalleryCard({ c }: { c: GalleryProps }) {
    return (
        <Link
            key={c.name}
            aria-label={c.name}
            className='group relative w-full overflow-hidden rounded-lg'
            href={`/rockstar/gallery/${Path(c.name)}`}
        >
            <Image
                alt={c.name}
                className='h-[240px] w-full object-cover object-center 2xl:h-[220px]'
                classNames={{ wrapper: '!max-w-full' }}
                src={c.thumbnail}
            />
            <p className='absolute bottom-0 z-20 flex w-full justify-between rounded-b-lg bg-black bg-opacity-20 p-1 px-3 text-xs leading-relaxed text-white'>
                <span>{Name(c.name)} </span>
                <span>{formatDateTime(Date(c.name))}</span>
            </p>
        </Link>
    )
}

function Name(name: string) {
    return name.replace(/^\d{4}-\d{2}-\d{2}-|\.[^.]+$/g, '')
}

function Date(date: string) {
    const match = date.match(/^\d{4}-\d{2}-\d{2}/)

    return match ? match[0] : ''
}

function Path(name: string) {
    return name.replace(/\.[^.]+$/, '')
}
