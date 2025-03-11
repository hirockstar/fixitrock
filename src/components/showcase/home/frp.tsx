'use client'
import { Card, CardFooter, CardHeader, Image } from '@heroui/react'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
import React from 'react'

import { useSupabse } from '®/hooks/tanstack/query'
import { formatDateTime } from '®/lib/utils'
import { TitleAction } from '®/ui'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '®/ui/carousel'
import { GridSkeleton } from '®/ui/skeleton'

export function FRP() {
    const { data, isLoading } = useSupabse('frp')

    return (
        <TitleAction href='/frp' title='FRP Bypass'>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 2500,
                    }),
                ]}
            >
                <CarouselContent>
                    {isLoading ? (
                        <div className='flex gap-4 px-4'>
                            <GridSkeleton length={6} />
                        </div>
                    ) : (
                        data?.slice(0, 6).map((f) => (
                            <CarouselItem key={f.id} className='basis-[320px]'>
                                <Card
                                    aria-label={f.title}
                                    className='w-full rounded-2xl border bg-transparent'
                                    shadow='none'
                                >
                                    <Link passHref href={f.link} target='_blank'>
                                        <CardHeader className='mb-[1px] p-2'>
                                            <h1 className='line-clamp-1 text-start text-[13px]'>
                                                {f.title}
                                            </h1>
                                        </CardHeader>
                                        <Image
                                            isBlurred
                                            alt={f.title}
                                            className={`aspect-video h-40 rounded-lg bg-default/5 object-contain p-2 dark:bg-default/10`}
                                            classNames={{ wrapper: 'mx-auto' }}
                                            loading='lazy'
                                            src={f.img}
                                        />
                                        <CardFooter className='justify-end p-2 text-xs text-muted-foreground'>
                                            <p>{formatDateTime(f.created_at)}</p>
                                        </CardFooter>
                                    </Link>
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
