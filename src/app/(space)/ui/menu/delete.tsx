'use client'

import * as React from 'react'
import { useActionState } from 'react'
import {
    Button,
    Modal,
    ModalBody,
    Form,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Image,
} from '@heroui/react'

import { canDelete } from '@/actions/drive'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { DriveItem } from '@/types/drive'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/ui/drawer'

interface DeleteProps {
    item: DriveItem
    open: boolean
    onOpenChange: (open: boolean) => void
    currentPath: string
    onDeleteSuccess?: (item: DriveItem) => void
    onDeleteError?: (error: string) => void
}

export function Delete({
    item,
    open,
    onOpenChange,
    currentPath,
    onDeleteSuccess,
    onDeleteError,
}: DeleteProps) {
    const [deleteState, deleteAction, isDeleting] = useActionState(canDelete, { errors: {} })
    const lastDeleteState = React.useRef<typeof deleteState | null>(null)
    const isDesktop = useMediaQuery('(min-width: 768px)')

    // Handle delete success/error
    React.useEffect(() => {
        // Only process if this is a new state (different from last processed)
        if (lastDeleteState.current !== deleteState) {
            if (deleteState.success && deleteState.message) {
                onDeleteSuccess?.(item)
                onOpenChange(false)
            } else if (deleteState.errors && Object.keys(deleteState.errors).length > 0) {
                const errorMessage = Object.values(deleteState.errors)[0] || 'Failed to delete item'

                onDeleteError?.(errorMessage)
            }

            // Update the last processed state
            lastDeleteState.current = deleteState
        }
    }, [deleteState, item, onDeleteSuccess, onDeleteError, onOpenChange])

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open) {
            lastDeleteState.current = null
        }
    }, [open])

    const handleSubmit = (formData: FormData) => {
        formData.set('itemId', item.id)
        formData.set('itemName', item.name)
        formData.set('currentPath', currentPath)
        deleteAction(formData)
    }

    if (isDesktop) {
        return (
            <Modal
                className='bg-background/80 border backdrop-blur'
                isOpen={open}
                shadow='none'
                size='md'
                onOpenChange={onOpenChange}
            >
                <Form action={handleSubmit}>
                    <ModalContent>
                        <ModalHeader className='text-muted-foreground mx-auto items-center py-0 text-center'>
                            <Image
                                isBlurred
                                alt='Delete'
                                className='size-40'
                                src='/onedrive/delete.webp'
                            />
                        </ModalHeader>
                        <ModalBody>
                            <h1 className='text-muted-foreground text-center text-balance'>
                                Are you sure you want to delete
                                <p className='text-foreground'>{item.name}</p>
                            </h1>
                        </ModalBody>
                        <ModalFooter className='gap-4'>
                            <Button
                                fullWidth
                                className='bg-default/40'
                                isDisabled={isDeleting}
                                radius='full'
                                size='sm'
                                onPress={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                fullWidth
                                color='danger'
                                isDisabled={isDeleting}
                                isLoading={isDeleting}
                                radius='full'
                                size='sm'
                                type='submit'
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Form>
            </Modal>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <Form action={handleSubmit}>
                <DrawerContent>
                    <DrawerHeader className='py-0'>
                        <DrawerTitle className='text-muted-foreground mx-auto items-center text-center'>
                            <Image
                                isBlurred
                                alt='Delete'
                                className='size-40'
                                src='/onedrive/delete.webp'
                            />
                        </DrawerTitle>
                    </DrawerHeader>
                    <h1 className='text-muted-foreground text-center text-balance'>
                        Are you sure you want to delete
                        <p className='text-foreground'>{item.name}</p>
                    </h1>
                    <DrawerFooter className='flex-row gap-4'>
                        <Button
                            fullWidth
                            className='bg-default/40'
                            isDisabled={isDeleting}
                            radius='full'
                            size='sm'
                            onPress={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            color='danger'
                            isDisabled={isDeleting}
                            isLoading={isDeleting}
                            radius='full'
                            size='sm'
                            type='submit'
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Form>
        </Drawer>
    )
}
