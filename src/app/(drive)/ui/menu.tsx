'use client'

import * as React from 'react'
import { Listbox, ListboxItem, ListboxSection } from '@heroui/react'
import { toast } from 'sonner'
import { FolderSymlink } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { siteConfig } from '®config/site'
import { useMediaQuery } from '®hooks/useMediaQuery'
import { logWarning } from '®lib/utils'
import { DriveItem } from '®types/drive'
import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
} from '®ui/context-menu'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '®ui/drawer'
import { Delete, Link, NewTab, NewWindow, Rename, Share } from '®ui/icons'

export function Menu({
    c,
    open,
    setOpen,
    onSelected,
}: {
    c: DriveItem
    open: boolean
    setOpen: (open: boolean) => void
    onSelected: (c: DriveItem) => void
}) {
    const path = usePathname()
    const isDesktop = useMediaQuery('(min-width: 640px)')
    const url = `${siteConfig.domain}${c.folder ? `${c.href}` : `${path}#${c.name}`}`

    const handleCopy = () => {
        const promise = copy(url)

        toast.promise(promise, {
            loading: 'Hang tight... Grabbing your link!',
            success: () => `Hooray! The link to ${c.name} is copied!`,
            error: () => `Oops! Couldn't copy the link. Give it another try!`,
        })
    }

    const handleShare = () => share(url)

    const openInNewTab = () => window.open(url, '_blank')
    const openInNewWindow = () => {
        const width = window.innerWidth
        const height = window.innerHeight

        window.open(url, '_blank', `width=${width},height=${height}`)
    }

    return isDesktop ? (
        <ContextMenuContent key={open ? 'open' : 'closed'} className='w-[280px]'>
            <div className='flex items-center'>
                <ContextMenuItem className='w-full flex-col gap-1' onSelect={handleCopy}>
                    <Link /> Copy
                </ContextMenuItem>
                <ContextMenuItem className='w-full flex-col gap-1' onSelect={handleShare}>
                    <Share /> Share
                </ContextMenuItem>
                <ContextMenuItem disabled className='w-full flex-col gap-1'>
                    <Rename /> Rename
                </ContextMenuItem>
                <ContextMenuItem disabled className='w-full flex-col gap-1 text-danger'>
                    <Delete /> Delete
                </ContextMenuItem>
            </div>
            <ContextMenuSeparator />
            <ContextMenuItem className='gap-2' onSelect={() => onSelected(c)}>
                <FolderSymlink size={20} /> Open<ContextMenuShortcut>enter</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem className='gap-2' onSelect={openInNewTab}>
                <NewTab /> Open in new tab
            </ContextMenuItem>
            <ContextMenuItem className='gap-2' onSelect={openInNewWindow}>
                <NewWindow /> Open in new window
            </ContextMenuItem>
        </ContextMenuContent>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className='sr-only'>
                    <DrawerTitle />
                    <DrawerDescription />
                </DrawerHeader>
                <Listbox aria-label='Menu' disabledKeys={['rename', 'delete']} variant='flat'>
                    <ListboxSection classNames={{ group: 'flex items-center border-b' }}>
                        <ListboxItem
                            key='copy'
                            classNames={{ title: 'flex flex-col items-center' }}
                            textValue='Copy'
                            onPress={handleCopy}
                        >
                            <Link /> Copy
                        </ListboxItem>
                        <ListboxItem
                            key='share'
                            classNames={{ title: 'flex flex-col items-center' }}
                            textValue='Share'
                            onPress={handleShare}
                        >
                            <Share /> Share
                        </ListboxItem>
                        <ListboxItem
                            key='rename'
                            classNames={{ title: 'flex flex-col items-center' }}
                            textValue='Rename'
                        >
                            <Rename /> Rename
                        </ListboxItem>
                        <ListboxItem
                            key='delete'
                            classNames={{ title: 'flex flex-col items-center text-danger' }}
                            textValue='Delete'
                        >
                            <Delete /> Delete
                        </ListboxItem>
                    </ListboxSection>
                    <ListboxSection>
                        <ListboxItem
                            key='open'
                            endContent={
                                <span className='text-small text-muted-foreground'>enter</span>
                            }
                            startContent={<FolderSymlink size={20} />}
                            textValue='Open'
                            onPress={() => onSelected(c)}
                        >
                            Open
                        </ListboxItem>
                        <ListboxItem
                            key='open-in-new-tab'
                            startContent={<NewTab />}
                            textValue='Open in new tab'
                            onPress={openInNewTab}
                        >
                            Open in new tab
                        </ListboxItem>
                        <ListboxItem
                            key='open-in-new-window'
                            startContent={<NewWindow />}
                            textValue='Open in new window'
                            onPress={openInNewWindow}
                        >
                            Open in new window
                        </ListboxItem>
                    </ListboxSection>
                </Listbox>
            </DrawerContent>
        </Drawer>
    )
}

const share = async (url: string) => {
    try {
        if (url && navigator.share) {
            await navigator.share({ title: 'Check this out!', url })
        } else {
            alert('Sharing is not supported or URL is invalid.')
        }
    } catch (error) {
        logWarning('Error sharing:', error instanceof Error ? error.message : error)
    }
}

const copy = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject('Invalid URL to copy.')
        } else {
            navigator.clipboard
                .writeText(url)
                .then(() => resolve(url))
                .catch((error) => reject(error instanceof Error ? error.message : error))
        }
    })
}
