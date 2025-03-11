'use client'
import { Card, CardBody } from '@heroui/react'
import Autoplay from 'embla-carousel-autoplay'
import React from 'react'

import { useQuote } from '®/hooks/tanstack/query'
import { formatDateTime } from '®/lib/utils'
import { TitleAction } from '®/ui'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '®/ui/carousel'
import { QuoteSkeleton } from '®/ui/skeleton'

export function Quotes() {
    const { data, isLoading } = useQuote()

    return (
        <TitleAction href='/rockstar' title='Quotes'>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                ]}
            >
                <CarouselContent>
                    {isLoading ? (
                        <div className='flex gap-4 px-4'>
                            <QuoteSkeleton length={6} />
                        </div>
                    ) : (
                        data?.slice(0, 6).map((q) => (
                            <CarouselItem key={q.id} className='basis-[320px]'>
                                <Card className='flex w-full select-none flex-col justify-between bg-muted shadow-none'>
                                    <CardBody className='flex flex-1 flex-col'>
                                        <p className='flex h-[180px] items-center justify-center text-balance text-center font-mono text-lg'>
                                            "{q.quote}"
                                        </p>
                                        <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                            <span>{formatDateTime(q.lastModifiedDateTime)}</span>
                                            <span>— Rock Star 💕</span>
                                        </div>
                                    </CardBody>
                                </Card>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
                {!isLoading && <CarouselDots />}
            </Carousel>
        </TitleAction>
    )
}
