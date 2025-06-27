'use client'

import Link from 'next/link'
import { Image } from '@heroui/react'

import { useMemoirs } from '®hooks/tanstack/query'
import { formatDateTime } from '®lib/utils'
import AnimatedDiv from '®ui/farmer/div'
import { BlogCardAnimation, fromLeftVariant } from '®lib/FramerMotionVariants'

import { Name, Date } from './utils'

export default function Memoirs() {
    const { data, ref, isLoading, isFetchingNextPage } = useMemoirs('/rockstar/memoirs')

    return (
        <main className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2 px-1'>
            {isLoading ? (
                <Skeleton />
            ) : (
                data
                    ?.slice()
                    .reverse()
                    .map((c) => (
                        <AnimatedDiv
                            key={c.id}
                            mobileVariants={BlogCardAnimation}
                            variants={fromLeftVariant}
                        >
                            <Link
                                aria-label={c.name}
                                className='group relative w-full overflow-hidden rounded-lg'
                                href={`/rockstar/memoirs/${c.name}`}
                            >
                                <Image
                                    isZoomed
                                    alt={c.name}
                                    className='h-[240px] w-full object-cover object-center 2xl:h-[220px]'
                                    classNames={{ wrapper: 'max-w-full!' }}
                                    src={
                                        c.thumbnails[0].large?.url ||
                                        'https://avatars.githubusercontent.com/u/45270927?v=4'
                                    }
                                />
                                <p className='bg-opacity-20 absolute bottom-0 z-20 flex w-full justify-between rounded-b-lg bg-black p-1 px-3 text-xs leading-relaxed text-white'>
                                    <span>{Name(c.name)} </span>
                                    <span>{formatDateTime(Date(c.name))}</span>
                                </p>
                            </Link>
                        </AnimatedDiv>
                    ))
            )}
            <div ref={ref} />
            {isFetchingNextPage && <Skeleton />}
        </main>
    )
}

const Skeleton = ({ length = 15 }: { length?: number }) => {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <Image
                    key={index}
                    alt='Loading skeleton'
                    className='h-[240px] w-full object-cover object-center 2xl:h-[220px]'
                    classNames={{ wrapper: 'max-w-full!' }}
                    isLoading={true}
                    src='https://rdrive-ui.vercel.app/icons/fixitrock.png'
                />
            ))}
        </>
    )
}
