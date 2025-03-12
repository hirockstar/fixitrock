'use client'

import { Card, CardFooter, CardHeader } from '@heroui/react'
import React from 'react'

import { useMediaQuery } from '®/hooks/useMediaQuery'
import { BlogCardAnimation, fromLeftVariant } from '®/lib/FramerMotionVariants'
import { formatBytes, formatDateTime } from '®/lib/utils'
import { Drive, DriveItem } from '®/types/drive'
import { ContextMenu, ContextMenuTrigger } from '®/ui/context-menu'
import AnimatedDiv from '®/ui/farmer/div'
import { MagicCard } from '®/ui/magiccard'
import { GridSkeleton } from '®/ui/skeleton'
import { Menu } from './menu'
import { Thumbnail } from '®ui'

export function Grid({
    data,
    isLoading,
    onSelect,
    loadMore,
    focus,
}: {
    data?: Drive
    isLoading?: boolean
    loadMore?: boolean
    onSelect: (item: DriveItem) => void
    focus?: DriveItem | null
}) {
    const [active, setActive] = React.useState<DriveItem | null>(null)
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery('(min-width: 640px)')

    return (
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-2'>
            {isLoading ? (
                <GridSkeleton />
            ) : (
                data?.value.map((c) => (
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
                        <ContextMenuTrigger onClick={() => onSelect(c)}>
                            <AnimatedDiv
                                mobileVariants={BlogCardAnimation}
                                variants={fromLeftVariant}
                            >
                                <Card
                                    aria-label={c?.name}
                                    className='w-full select-none rounded-2xl border bg-transparent'
                                    isPressable={isDesktop}
                                    shadow='none'
                                    onPress={() => onSelect(c)}
                                >
                                    <MagicCard
                                        className={`${focus?.name === c.name ? 'bg-teal-400/20 dark:bg-teal-400/25' : ''}`}
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
                                    </MagicCard>
                                </Card>
                            </AnimatedDiv>
                        </ContextMenuTrigger>
                        <Menu
                            c={c}
                            open={active?.id === c.id && open}
                            setOpen={(open) => {
                                setActive(c)
                                setOpen(open)
                            }}
                            onSelected={onSelect}
                        />
                    </ContextMenu>
                ))
            )}
            {loadMore && <GridSkeleton />}
        </div>
    )
}
