'use client'
import React, { Dispatch, SetStateAction } from 'react'
import { Button, Modal, ModalContent, ModalHeader, Skeleton, User } from '@heroui/react'
import { Download } from 'lucide-react'
import Link from 'next/link'
import { FaLocationDot } from 'react-icons/fa6'

import { useMediaQuery } from '®/hooks/useMediaQuery'
import { DriveItem } from '®/types/drive'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '®/ui/drawer'
import { useLocation } from '®hooks/tanstack/query'

import { randomSlang } from '../utils'

import Switch from './switch'

type PreviewProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    c: DriveItem
}

function UserInfo({ data, isLoading }: { data?: DriveItem; isLoading: boolean }) {
    const address = data?.location?.address
    const location = address
        ? `${address.city}, ${address.locality}, ${address.postalCode}, ${address.state}, ${address.countryOrRegion}`
        : randomSlang()

    return (
        <User
            avatarProps={{ src: '/icons/fixitrock.png' }}
            description={
                <Link
                    passHref
                    className='text-muted-foreground flex items-center gap-1 text-xs'
                    href={`https://www.google.com/maps/search/?api=1&query=${location}`}
                    rel='noopener noreferrer'
                    target='_blank'
                >
                    <FaLocationDot />
                    <Skeleton isLoaded={!isLoading}>
                        <p className='text-muted-foreground line-clamp-1 text-xs'>{location}</p>
                    </Skeleton>
                </Link>
            }
            name='Rock Star 💕'
        />
    )
}
export function Preview({ open, setOpen, c }: PreviewProps) {
    const isDesktop = useMediaQuery('(min-width: 640px)')
    const { data, isLoading } = useLocation(c.id)

    const handleDownload = () => {
        const downloadUrl = c['@microsoft.graph.downloadUrl']

        if (downloadUrl) {
            const link = document.createElement('a')

            link.href = downloadUrl
            link.setAttribute('download', c.name)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    if (isDesktop) {
        return (
            <Modal
                hideCloseButton
                className='max-w-6xl'
                isOpen={open}
                placement='center'
                scrollBehavior='inside'
                onOpenChange={setOpen}
            >
                <ModalContent className='h-full max-h-[75vh] overflow-hidden border dark:bg-black'>
                    <Switch file={c} />
                    <ModalHeader aria-hidden className='hidden' />
                </ModalContent>
            </Modal>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className='gap-3 overflow-auto p-2'>
                <DrawerTitle>
                    <div className='flex w-full items-center justify-between gap-2'>
                        <UserInfo data={data} isLoading={isLoading} />
                        <Button
                            isIconOnly
                            radius='full'
                            size='sm'
                            variant='light'
                            onPress={handleDownload}
                        >
                            <Download size={20} />
                        </Button>
                    </div>
                </DrawerTitle>
                <Switch file={c} />
                <DrawerDescription aria-hidden />
            </DrawerContent>
        </Drawer>
    )
}
