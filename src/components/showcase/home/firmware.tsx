'use client'
import { Card, CardHeader, CardFooter } from '@heroui/react'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
import React from 'react'

import { Menu } from '®/components/drive/menu'
import { Thumbnail } from '®/components/drive/thumbnail'
import { useDrive } from '®/hooks/tanstack/query'
import { formatBytes, formatDateTime } from '®/lib/utils'
import { DriveItem } from '®/types/drive'
import { TitleAction } from '®/ui'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '®/ui/carousel'
import { ContextMenu, ContextMenuTrigger } from '®/ui/context-menu'
import { GridSkeleton } from '®/ui/skeleton'

export function Firmware() {
    const { data, isLoading, selectItem } = useDrive('', 12)
    const [active, setActive] = React.useState<DriveItem | null>(null)
    const [open, setOpen] = React.useState(false)

    return (
        <TitleAction href='/fw' title='Firmware'>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                ]}
            >
                <CarouselContent>
                    {isLoading ? (
                        <div className='flex gap-3 px-4'>
                            <GridSkeleton length={6} />
                        </div>
                    ) : (
                        data?.value.map((c) => (
                            <CarouselItem key={c.id} className='basis-[320px]'>
                                <ContextMenu
                                    key={c.id}
                                    onOpenChange={(open) => {
                                        setOpen(open)
                                        if (open) {
                                            setActive(c)
                                        } else {
                                            setActive(null)
                                        }
                                    }}
                                >
                                    <ContextMenuTrigger>
                                        <Card
                                            aria-label={c?.name}
                                            as={Link}
                                            className='w-full select-none rounded-2xl border bg-transparent'
                                            href={`/fw/${c.name}`}
                                            shadow='none'
                                        >
                                            <CardHeader className='mb-[1px] p-2'>
                                                <h1 className='truncate text-start text-[13px]'>
                                                    {c?.name}
                                                </h1>
                                            </CardHeader>
                                            <Thumbnail
                                                name={c?.name as string}
                                                src={c?.thumbnails?.[0]?.large?.url || ''}
                                                type='Grid'
                                            />
                                            <CardFooter className='grid grid-cols-3 p-2 text-xs text-muted-foreground'>
                                                <p className='truncate text-start'>
                                                    {formatBytes(c?.size)}
                                                </p>
                                                <p className='truncate text-center' />
                                                <p className='truncate text-right'>
                                                    {formatDateTime(c?.lastModifiedDateTime)}
                                                </p>
                                            </CardFooter>
                                        </Card>
                                    </ContextMenuTrigger>
                                    <Menu
                                        c={c}
                                        open={active?.id === c.id && open}
                                        setOpen={(open) => {
                                            setActive(c)
                                            setOpen(open)
                                        }}
                                        onSelected={selectItem}
                                    />
                                </ContextMenu>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
                {!isLoading && <CarouselDots />}
            </Carousel>
        </TitleAction>
    )
}
