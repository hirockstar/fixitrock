'use client'

import { Card, CardFooter, CardHeader } from '@heroui/react'
import React from 'react'
import Link from 'next/link'

import { getHref } from '../utils'
import { useSelectItem } from '../hooks'

import { BlogCardAnimation, fromLeftVariant } from '@/lib/FramerMotionVariants'
import { formatBytes, formatDateTime } from '@/lib/utils'
import { Drive, DriveItem } from '@/types/drive'
import { ContextMenu, ContextMenuTrigger } from '@/ui/context-menu'
import AnimatedDiv from '@/ui/farmer/div'
import { MagicCard } from '@/ui/magiccard'
import { GridSkeleton } from '@/ui/skeleton'
import { Thumbnail } from '@/ui'
import { Menu } from '@/app/(space)/ui'
import { isFolder, isPreviewable } from '@/lib/utils'
import { useKeyboardNavigation } from '@/hooks'

export function Grid({
    data,
    loadMore,
    focus,
}: {
    data?: Drive
    isLoading?: boolean
    loadMore?: boolean
    focus?: DriveItem | null
}) {
    const [active, setActive] = React.useState<DriveItem | null>(null)
    const [open, setOpen] = React.useState(false)
    const onSelect = useSelectItem(setActive, setOpen)
    const { selectedIndex, listRef, getItemRef } = useKeyboardNavigation({
        length: data?.value.length ?? 0,
        mode: 'grid',
        onSelect: (index) => {
            const c = data?.value?.[index]

            if (c) onSelect(c)
        },
    })

    return (
        <div ref={listRef} className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4'>
            {data?.value.map((c, index) => {
                const isFolderOrPreviewable = isFolder(c) || isPreviewable(c)
                const href = isFolderOrPreviewable ? getHref(c) : undefined
                const cardProps = href ? { as: Link, href } : {}

                return (
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
                                ref={getItemRef(index)}
                                className='h-full w-full'
                                mobileVariants={BlogCardAnimation}
                                variants={fromLeftVariant}
                            >
                                <Card
                                    aria-label={c?.name}
                                    className={`h-full w-full rounded-xl border bg-transparent transition-all duration-200 select-none hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${selectedIndex === index ? 'dark:border-bg-teal-400/25 border-teal-400/20' : focus?.name === c.name ? 'bg-teal-400/20 ring-2 ring-teal-400/50 dark:bg-teal-400/25' : ''}`}
                                    data-index={index}
                                    shadow='none'
                                    onPress={() => onSelect(c)}
                                    {...cardProps}
                                >
                                    <MagicCard className='flex h-full flex-col'>
                                        <CardHeader className='p-3 pb-1'>
                                            <h1 className='truncate text-start text-sm font-medium'>
                                                {c?.name}
                                            </h1>
                                        </CardHeader>
                                        <Thumbnail
                                            name={c?.name as string}
                                            src={c?.thumbnails?.[0]?.large?.url || ''}
                                            type='Grid'
                                        />

                                        <CardFooter className='text-muted-foreground grid grid-cols-2 gap-2 p-3 pt-2 text-xs'>
                                            <p className='flex items-center gap-1 truncate text-start'>
                                                <span className='text-[10px]'>📦</span>
                                                {formatBytes(c?.size)}
                                            </p>
                                            <p className='flex items-center justify-end gap-1 truncate text-end'>
                                                <span className='text-[10px]'>🕒</span>
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
                )
            })}
            {loadMore && <GridSkeleton />}
        </div>
    )
}
