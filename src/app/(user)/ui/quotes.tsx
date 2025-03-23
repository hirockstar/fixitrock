'use client'

import { Card, CardBody } from '@heroui/react'

import AnimatedDiv from '®/ui/farmer/div'
import { BlogCardAnimation, fromLeftVariant } from '®/lib/FramerMotionVariants'
import { QuoteSkeleton } from '®/ui/skeleton'
import { useQuote } from '®tanstack/query'
import { formatDateTime } from '®lib/utils'

export function Quotes() {
    const { data, isLoading } = useQuote()

    return (
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-2 px-1'>
            {isLoading ? (
                <QuoteSkeleton />
            ) : (
                data?.map((q) => (
                    <AnimatedDiv
                        key={q.id}
                        mobileVariants={BlogCardAnimation}
                        variants={fromLeftVariant}
                    >
                        <Card className='flex w-full select-none flex-col justify-between bg-muted shadow-none'>
                            <CardBody className='flex flex-1 flex-col'>
                                <p className='flex h-[180px] items-center justify-center text-balance text-center text-lg font-semibold'>
                                    "{q.quote}"
                                </p>
                                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                    <span>{formatDateTime(q.lastModifiedDateTime)}</span>
                                    <span>— Rock Star 💕</span>
                                </div>
                            </CardBody>
                        </Card>
                    </AnimatedDiv>
                ))
            )}
        </div>
    )
}
