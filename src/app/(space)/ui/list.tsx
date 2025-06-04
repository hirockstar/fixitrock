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
                                    disableRipple
                                    isHoverable
                                    aria-label={c?.name}
                                    className={`data-[hover=true]:bg-muted/30 w-full rounded-lg border bg-transparent p-0.5 pl-1 select-none dark:data-[hover=true]:bg-[#0a0a0a] ${focus?.name === c.name ? 'bg-teal-400/20 dark:bg-teal-400/25' : ''}`}
                                    isPressable={isDesktop}
                                    shadow='none'
                                    onPress={() => onSelect(c)}
                                    {...cardProps}
                                >
                                    <CardBody className='flex flex-row items-center gap-2 p-0.5'>
                                        <Thumbnail
                                            name={c?.name as string}
                                            src={c?.thumbnails?.[0]?.large?.url}
                                            type='List'
                                        />
                                        <div className='flex-1 space-y-[2px] overflow-hidden'>
                                            <h2 className='truncate text-start text-[13px]'>
                                                {c?.name}
                                            </h2>
                                            <p className='text-muted-foreground text-xs'>
                                                {[
                                                    formatBytes(c?.size),
                                                    c?.folder?.childCount &&
                                                        formatCount(c.folder.childCount),
                                                    c?.lastModifiedDateTime &&
                                                        formatDateTime(c?.lastModifiedDateTime),
                                                ]
                                                    .filter(Boolean)
                                                    .map((item, index, arr) => (
                                                        <span key={index}>
                                                            {item}
                                                            {index < arr.length - 1 && (
                                                                <span className='mx-2'>•</span>
                                                            )}
                                                        </span>
                                                    ))}
                                            </p>
                                        </div>
                                        <span className='w-10' />
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
