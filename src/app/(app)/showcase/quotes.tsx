'use client'

import { Card, CardBody } from '@heroui/react'
import Autoplay from 'embla-carousel-autoplay'
import { SiSupabase } from 'react-icons/si'
import { TbDatabaseStar, TbPlugConnectedX } from 'react-icons/tb'

import { useQuote } from '®tanstack/query'
import { formatDateTime } from '®lib/utils'
import { TitleAction } from '®ui'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '®ui/carousel'
import { QuoteSkeleton } from '®ui/skeleton'
import { ErrorState } from '®ui/state'

export default function Quotes() {
    const { data, isLoading, error } = useQuote()

    return (
        <TitleAction href='/rockstar' title='Quotes'>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 2800,
                    }),
                ]}
            >
                <CarouselContent>
                    {isLoading ? (
                        <QuoteSkeleton length={6} />
                    ) : error ? (
                        <ErrorState
                            icons={[TbDatabaseStar, SiSupabase, TbPlugConnectedX]}
                            message={error.message}
                            title='Yo, FRP Data is MIA'
                        />
                    ) : (
                        data?.slice(0, 6).map((q) => (
                            <CarouselItem key={q.id} className='basis-[320px]'>
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
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
                {!isLoading && <CarouselDots />}
            </Carousel>
        </TitleAction>
    )
}
