'use client'
import { Card, CardBody, CardFooter, CardHeader, Skeleton } from '@heroui/react'

import { cn } from '®lib/utils'

import { MagicCard } from './magiccard'

type GridSkeletonProps = {
    length?: number
    className?: string
}

export const GridSkeleton = ({ length = 18, className }: GridSkeletonProps) => {
    if (!length) return null

    return (
        <>
            {Array.from({ length }).map((_, i) => (
                <Card
                    key={i}
                    className={cn('rounded-2xl border bg-transparent', className)}
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
                        </CardFooter>
                    </MagicCard>
                </Card>
            ))}
        </>
    )
}

export const QuoteSkeleton = ({
    length = 15,
    className,
}: {
    length?: number
    className?: string
}) => {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <Card
                    key={index}
                    className={cn(
                        'rounded-none border-b bg-transparent p-0 md:rounded-xl md:border',
                        className
                    )}
                    shadow='none'
                >
                    <CardHeader className='flex w-full justify-between'>
                        <div className='flex items-center gap-2'>
                            <Skeleton className='size-10 rounded-full' />
                            <div className='flex flex-col gap-1'>
                                <Skeleton className='h-4 w-20 rounded' />
                                <div className='flex items-center gap-1'>
                                    <Skeleton className='h-3 w-16 rounded' />
                                    <Skeleton className='h-3 w-16 rounded' />
                                </div>
                            </div>
                        </div>
                        <Skeleton className='size-8 rounded-full' />
                    </CardHeader>

                    <CardBody className='relative h-52'>
                        <div className='border-default-200/50 from-default-50/60 to-default-100/40 relative flex h-full items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br'>
                            <div className='text-primary/25 absolute top-3 left-4 -rotate-12 transform font-serif text-5xl leading-none transition-all duration-300 select-none'>
                                "
                            </div>
                            <div className='text-primary/25 absolute right-4 bottom-1 rotate-12 transform font-serif text-5xl leading-none transition-all duration-300 select-none'>
                                "
                            </div>

                            <div className='flex h-full w-full items-center justify-center px-6 py-4'>
                                <div className='flex w-full max-w-full flex-col gap-3 text-center'>
                                    <Skeleton className='h-5 w-full rounded' />
                                    <Skeleton className='mx-auto h-5 w-4/5 rounded' />
                                    <Skeleton className='mx-auto h-5 w-3/5 rounded' />
                                </div>
                            </div>

                            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                                <Skeleton className='absolute top-4 left-6 h-1 w-1 animate-pulse rounded-full' />
                                <Skeleton className='absolute top-8 right-8 h-0.5 w-0.5 animate-pulse rounded-full' />
                                <Skeleton className='absolute bottom-6 left-8 h-1.5 w-1.5 animate-pulse rounded-full' />
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className='flex w-full items-center justify-between space-x-2'>
                        <Skeleton className='h-8 w-18 rounded-full' />
                        <Skeleton className='h-8 w-18 rounded-full' />
                        <Skeleton className='h-8 w-18 rounded-full' />
                        <Skeleton className='h-8 w-18 rounded-full' />
                    </CardFooter>
                </Card>
            ))}
        </>
    )
}
export const ListSkeleton = () => {
    return (
        <>
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='flex items-center gap-2 rounded-lg border p-1'>
                    <Skeleton className='size-10 flex-shrink-0 rounded-lg' />
                    <div className='flex flex-grow flex-col gap-y-2'>
                        <Skeleton className='h-4 w-auto rounded-lg sm:max-w-lg' />
                        <span className='text-muted-foreground flex items-center gap-2 text-xs'>
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
        </>
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
