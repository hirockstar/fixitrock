'use client'
import { Card, CardFooter, CardHeader, Skeleton } from '@heroui/react'

import { MagicCard } from './magiccard'

export const GridSkeleton = () => {
    return (
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-4'>
            {Array.from({ length: 12 }).map((_, index) => (
                <Card
                    key={index}
                    isBlurred
                    isPressable
                    className='rounded-2xl border'
                    shadow='none'
                >
                    <MagicCard className='items-stretch'>
                        <CardHeader className='justify-between gap-x-2 p-2'>
                            <Skeleton className='h-4 flex-1 rounded-xl' />
                            <Skeleton className='h-6 w-6 rounded-lg' />
                        </CardHeader>
                        <Skeleton className='aspect-square h-40 w-full rounded-2xl' />
                        <CardFooter className='mt-[2px] justify-between p-2'>
                            <Skeleton className='h-4 w-20 rounded-xl' />
                            <Skeleton className='h-4 w-20 rounded-xl' />
                            <Skeleton className='h-4 w-20 rounded-xl' />
                        </CardFooter>
                    </MagicCard>
                </Card>
            ))}
        </div>
    )
}

export const ListSkeleton = () => {
    return (
        <div className='flex flex-col gap-2'>
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='flex items-center gap-2 rounded-lg border p-1'>
                    <Skeleton className='size-10 flex-shrink-0 rounded-lg' />
                    <div className='flex flex-grow flex-col gap-y-2'>
                        <Skeleton className='h-4 w-auto rounded-lg sm:max-w-lg' />
                        <span className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <Skeleton className='h-4 w-14 rounded-lg sm:w-20' /> •{' '}
                            <Skeleton className='h-4 w-14 rounded-lg sm:w-20' /> •{' '}
                            <Skeleton className='h-4 w-14 rounded-lg sm:w-20' />
                        </span>
                    </div>
                    <div className='flex-1'>
                        <div className='flex items-end justify-end'>
                            {' '}
                            <Skeleton className='size-10 justify-end rounded-lg' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export const MarkdownSkeleton = () => {
    return (
        <div aria-busy='true' className='flex flex-col gap-4'>
            {/* Title */}
            <Skeleton className='h-6 w-3/4 rounded-md' />

            {/* Text Lines */}
            <Skeleton className='h-4 w-full rounded-md' />
            <Skeleton className='h-4 w-5/6 rounded-md' />
            <Skeleton className='h-4 w-4/6 rounded-md' />

            {/* Code Block / Image */}
            <Skeleton className='h-32 w-full rounded-md' />
        </div>
    )
}
