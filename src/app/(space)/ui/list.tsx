'use client'

import { Card, CardBody } from '@heroui/react'
import React from 'react'
import Link from 'next/link'
import { CornerDownLeft } from 'lucide-react'

import { useSelectItem } from '../hooks'
import { getHref } from '../utils'

import { BlogCardAnimation, fromTopVariant } from '@/lib/FramerMotionVariants'
import { formatBytes, formatCount, formatDateTime, isFolder, isPreviewable } from '@/lib/utils'
import { Drive, DriveItem } from '@/types/drive'
import { ContextMenu, ContextMenuTrigger } from '@/ui/context-menu'
import AnimatedDiv from '@/ui/farmer/div'
import { ListSkeleton } from '@/ui/skeleton'
import { Thumbnail } from '@/ui'
import { Menu } from '@/app/(space)/ui'
import { useKeyboardNavigation } from '@/hooks'

export function List({
    data,
    loadMore,
    focus,
}: {
    data?: Drive
    isLoading?: boolean
    loadMore?: boolean
    focus?: DriveItem | null
    ref: React.Ref<HTMLDivElement>
}) {
    const [active, setActive] = React.useState<DriveItem | null>(null)
    const [open, setOpen] = React.useState(false)
    const onSelect = useSelectItem(setActive, setOpen)
    const { selectedIndex, listRef } = useKeyboardNavigation({
        length: data?.value.length ?? 0,
        mode: 'list',
        onSelect: (index) => {
            const c = data?.value?.[index]

            if (c) onSelect(c)
        },
    })

    return (
        <div ref={listRef} className='flex flex-col gap-2'>
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
                                key={c.id}
                                mobileVariants={BlogCardAnimation}
                                variants={fromTopVariant}
                            >
                                <Card
                                    key={c.id}
                                    isHoverable
                                    aria-label={c?.name}
                                    className={`group data-[hover=true]:bg-muted/30 w-full rounded-xl border bg-transparent p-0 transition-all duration-200 select-none active:scale-[0.98] dark:data-[hover=true]:bg-[#0a0a0a] ${selectedIndex === index ? 'dark:border-bg-teal-400/25 border-teal-400/20' : focus?.name === c.name ? 'bg-teal-400/20 ring-2 ring-teal-400/50 dark:bg-teal-400/25' : ''}`}
                                    shadow='none'
                                    onPress={() => onSelect(c)}
                                    {...cardProps}
                                    data-index={index}
                                >
                                    <CardBody className='flex flex-row items-center gap-2 p-2'>
                                        <Thumbnail
                                            name={c?.name as string}
                                            src={c?.thumbnails?.[0]?.large?.url}
                                            type='List'
                                        />
                                        <div className='min-w-0 flex-1 space-y-1'>
                                            <h2 className='truncate text-start text-sm font-medium transition-colors group-hover:text-teal-500'>
                                                {c?.name}
                                            </h2>
                                            <div className='text-muted-foreground flex flex-wrap gap-x-2 gap-y-0.5 text-xs'>
                                                {[
                                                    c?.size && (
                                                        <span
                                                            key='size'
                                                            className='flex items-center gap-1'
                                                        >
                                                            <span className='text-[10px]'>📦</span>
                                                            {formatBytes(c.size)}
                                                        </span>
                                                    ),
                                                    c?.folder?.childCount && (
                                                        <span
                                                            key='count'
                                                            className='flex items-center gap-1'
                                                        >
                                                            <span className='text-[10px]'>📁</span>
                                                            {formatCount(c.folder.childCount)}
                                                        </span>
                                                    ),
                                                    c?.lastModifiedDateTime && (
                                                        <span
                                                            key='date'
                                                            className='flex items-center gap-1'
                                                        >
                                                            <span className='text-[10px]'>🕒</span>
                                                            {formatDateTime(c.lastModifiedDateTime)}
                                                        </span>
                                                    ),
                                                ]
                                                    .filter(Boolean)
                                                    .map((item, index) => (
                                                        <span
                                                            key={index}
                                                            className='inline-flex items-center'
                                                        >
                                                            {item}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                        {selectedIndex === index && (
                                            <CornerDownLeft
                                                className='text-muted-foreground opacity-70'
                                                size={18}
                                            />
                                        )}
                                    </CardBody>
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
            {loadMore && <ListSkeleton />}
        </div>
    )
}
