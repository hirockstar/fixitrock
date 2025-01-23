'use client'

import { Listbox, ListboxItem, ListboxSection } from '@heroui/react'
import * as React from 'react'
import { toast } from 'sonner'

import { siteConfig } from '®/config/site'
import { useMediaQuery } from '®/hooks/useMediaQuery'
import { logWarning } from '®/lib/utils'
import { DriveItem } from '®/types/drive'
import { ContextMenuContent } from '®/ui/context-menu'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '®/ui/drawer'
import { CopyLink, Delete, Rename, Share } from '®/ui/icons'

export function Menu({
    c,
    open,
    setOpen,
}: {
    c: DriveItem
    open: boolean
    setOpen: (open: boolean) => void
}) {
    const isDesktop = useMediaQuery('(min-width: 640px)')

    return isDesktop ? (
        <ContextMenuContent key={open ? 'open' : 'closed'}>
            <List c={c} />
        </ContextMenuContent>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className='sr-only'>
                    <DrawerTitle />
                    <DrawerDescription />
                </DrawerHeader>
                <List c={c} />
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
            setTimeout(() => {
                navigator.clipboard
                    .writeText(url)
                    .then(() => resolve(url))
                    .catch((error) => reject(error instanceof Error ? error.message : error))
            }, 100)
        }
    })
}

const List = React.memo(({ c }: { c: DriveItem }) => {
    const url = `${siteConfig.domain}${c.href}`

    return (
        <Listbox disabledKeys={['rename', 'delete']} variant='flat'>
            <ListboxSection title='Actions'>
                <ListboxItem
                    key='share'
                    description='Get a link to share'
                    startContent={<Share />}
                    title='Share'
                    onPress={() => share(url)}
                />
                <ListboxItem
                    key='copylink'
                    showDivider
                    description='Copy the link'
                    startContent={<CopyLink />}
                    title='Copy Link'
                    onPress={() => {
                        const promise = copy(url)

                        toast.promise(promise, {
                            loading: `Hang tight... We're grabbing your link!`,
                            success: () => `Hooray! The link to ${c.name} is copied!`,
                            error: () => `Oops! Couldn't copy the link. Give it another try!`,
                        })
                    }}
                />
                <ListboxItem
                    key='rename'
                    description='Change the name'
                    startContent={<Rename />}
                    title='Rename'
                />
                <ListboxItem
                    key='delete'
                    className='text-danger'
                    color='danger'
                    description='Permanently delete the file'
                    startContent={<Delete />}
                    title='Delete'
                />
            </ListboxSection>
        </Listbox>
    )
})

List.displayName = 'List'
