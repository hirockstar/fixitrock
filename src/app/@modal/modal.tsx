'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { Modal as UIModal, ModalContent, ModalHeader } from '@heroui/react'

import { useMediaQuery } from '®/hooks/useMediaQuery'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '®/ui/drawer'

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const isDesktop = useMediaQuery('(min-width: 640px)')

    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal()
        }
    }, [])

    function onDismiss() {
        router.back()
    }

    return createPortal(
        <div className='modal-backdrop'>
            {isDesktop ? (
                <UIModal
                    hideCloseButton
                    isOpen
                    className='max-w-5xl'
                    placement='center'
                    scrollBehavior='inside'
                    onOpenChange={onDismiss}
                >
                    <ModalContent className='overflow-auto border p-2 dark:bg-black'>
                        {children}
                        <ModalHeader aria-hidden className='hidden' />
                    </ModalContent>
                </UIModal>
            ) : (
                <Drawer open onOpenChange={onDismiss}>
                    <DrawerContent className='overflow-auto p-2'>
                        <DrawerTitle aria-hidden />
                        <DrawerDescription aria-hidden />
                        {children}
                    </DrawerContent>
                </Drawer>
            )}
        </div>,
        document.getElementById('modal-root')!
    )
}
