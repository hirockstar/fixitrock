'use client'
import { Modal, ModalContent, ModalHeader } from '@heroui/react'
import { Dispatch, SetStateAction } from 'react'

import { useMediaQuery } from '®/hooks/useMediaQuery'
import { DriveItem } from '®/types/drive'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '®/ui/drawer'

import Switch from './switch'

type PreviewProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    c: DriveItem
}

export function Preview({ open, setOpen, c }: PreviewProps) {
    const isDesktop = useMediaQuery('(min-width: 640px)')

    return (
        <>
            {isDesktop ? (
                <Modal
                    hideCloseButton
                    className='max-w-5xl'
                    isOpen={open}
                    placement='center'
                    scrollBehavior='inside'
                    onOpenChange={setOpen}
                >
                    <ModalContent className='overflow-auto border p-2 dark:bg-black'>
                        <Switch file={c} />
                        <ModalHeader aria-hidden className='hidden' />
                    </ModalContent>
                </Modal>
            ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent className='overflow-auto p-2'>
                        <DrawerTitle aria-hidden />
                        <DrawerDescription aria-hidden />
                        <Switch file={c} />
                    </DrawerContent>
                </Drawer>
            )}
        </>
    )
}
