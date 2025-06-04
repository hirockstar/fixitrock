'use client'

import { Card, CardBody } from '@heroui/react'
import React from 'react'
import Link from 'next/link'

import { useMediaQuery } from '®hooks/useMediaQuery'
import { BlogCardAnimation, fromTopVariant } from '®lib/FramerMotionVariants'
import { formatBytes, formatCount, formatDateTime, isFolder, isPreviewable } from '®lib/utils'
import { Drive, DriveItem } from '®types/drive'
import { ContextMenu, ContextMenuTrigger } from '®ui/context-menu'
import AnimatedDiv from '®ui/farmer/div'
import { ListSkeleton } from '®ui/skeleton'
import { Thumbnail } from '®ui'
import { Menu } from '®app/(space)/ui'

import { getHref } from '../utils'
import { useSelectItem } from '../hooks'
import { ArrowRight } from 'lucide-react'

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
    const isDesktop = useMediaQuery('(min-width: 640px)')
    const onSelect = useSelectItem(setActive, setOpen)

    return (
        <div className='flex flex-col gap-2 p-2 2xl:px-[2rem]'>
            {data?.value.map((c) => {
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
                                    className={`group transition-all data-[hover=true]:bg-muted/30 dark:data-[hover=true]:bg-[#0a0a0a] duration-200 active:scale-[0.98] w-full rounded-xl border bg-transparent p-0 select-none ${focus?.name === c.name ? 'ring-2 ring-teal-400/50 bg-teal-400/20 dark:bg-teal-400/25' : ''}`}
                                    shadow='none'
                                    onPress={() => onSelect(c)}
                                    {...cardProps}
                                >
                                    <CardBody className='flex flex-row items-center gap-2 p-3'>
                                        <Thumbnail
                                            name={c?.name as string}
                                            src={c?.thumbnails?.[0]?.large?.url}
                                            type='List'
                                        />
                                        <div className='flex-1 min-w-0 space-y-1'>
                                            <h2 className='truncate text-start text-sm font-medium group-hover:text-teal-500 transition-colors'>
                                                {c?.name}
                                            </h2>
                                            <div className='text-muted-foreground text-xs flex flex-wrap gap-x-2 gap-y-0.5'>
                                                {[
                                                    c?.size && (
                                                        <span key="size" className="flex items-center gap-1">
                                                            <span className="text-[10px]">📦</span>
                                                            {formatBytes(c.size)}
                                                        </span>
                                                    ),
                                                    c?.folder?.childCount && (
                                                        <span key="count" className="flex items-center gap-1">
                                                            <span className="text-[10px]">📁</span>
                                                            {formatCount(c.folder.childCount)}
                                                        </span>
                                                    ),
                                                    c?.lastModifiedDateTime && (
                                                        <span key="date" className="flex items-center gap-1">
                                                            <span className="text-[10px]">🕒</span>
                                                            {formatDateTime(c.lastModifiedDateTime)}
                                                        </span>
                                                    ),
                                                ]
                                                    .filter(Boolean)
                                                    .map((item, index, arr) => (
                                                        <span key={index} className="inline-flex items-center">
                                                            {item}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                        <div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                                            <ArrowRight className='text-muted-foreground' size={18} />
                                        </div>
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
