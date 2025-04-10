'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react'

import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle } from '®ui/drawer'
import { useInvoiceProduct } from '®hooks/tanstack/mutation'
import { useMediaQuery } from '®hooks/useMediaQuery'
import { InvoiceProduct } from '®types/invoice'
import { logWarning } from '®lib/utils'

type ProductModalProps = {
    invoiceId: string
    isOpen: boolean
    onClose: () => void
    initialData?: InvoiceProduct | null
    onProductUpdated: () => void
    isDeleting?: boolean
}

export default function ProductModal({
    invoiceId,
    isOpen,
    onClose,
    initialData,
    onProductUpdated,
    isDeleting = false,
}: ProductModalProps) {
    const isEdit = !!initialData?.id
    const isDesktop = useMediaQuery('(min-width: 640px)')
    const [isDeleteMode, setIsDeleteMode] = useState(isDeleting)

    const { addProduct, updateProduct, deleteProduct } = useInvoiceProduct(invoiceId)

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<Omit<InvoiceProduct, 'id' | 'created_at' | 'invoice_id'>>({
        defaultValues: {
            name: '',
            compatibility: '',
            qty: undefined,
            purchase_price: undefined,
            price: undefined,
        },
    })

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || '',
                compatibility: initialData.compatibility || '',
                qty: initialData.qty || undefined,
                purchase_price: initialData.purchase_price || undefined,
                price: initialData.price || undefined,
            })
        } else {
            reset()
        }

        setIsDeleteMode(isDeleting)
    }, [initialData, reset, isDeleting])

    const onSubmit = async (data: Omit<InvoiceProduct, 'id' | 'created_at' | 'invoice_id'>) => {
        try {
            const productData = { ...data, invoice_id: String(invoiceId) }

            if (isEdit && initialData?.id) {
                await updateProduct.mutateAsync({ id: initialData.id, ...productData })
            } else {
                await addProduct.mutateAsync(productData)
            }

            onProductUpdated()
            onClose()
        } catch (error) {
            logWarning('Failed to add/update product', error)
        }
    }

    const handleDelete = async () => {
        if (!initialData?.id) return
        try {
            await deleteProduct.mutateAsync(initialData.id)
            onProductUpdated()
            onClose()
        } catch (error) {
            logWarning('Failed to delete product', error)
        }
    }

    const FormFields = () => (
        <div className='flex flex-col gap-2.5'>
            <Input label='Product Name' {...register('name', { required: true })} size='sm' />
            <Input label='Compatibility' {...register('compatibility')} size='sm' />
            <Input
                label='Quantity'
                type='number'
                {...register('qty', { required: true })}
                size='sm'
            />
            <Input
                label='Purchase Price'
                type='number'
                {...register('purchase_price', { required: true })}
                size='sm'
            />
            <Input
                label='Selling Price'
                type='number'
                {...register('price', { required: true })}
                size='sm'
            />
        </div>
    )

    const DeleteText = () => (
        <p className='text-sm'>
            Are you sure you want to delete <span className='font-medium'>{initialData?.name}</span>
            ?
        </p>
    )

    const FooterActions = () => (
        <div className='flex w-full gap-2'>
            <Button fullWidth className='border' radius='full' variant='light' onPress={onClose}>
                Cancel
            </Button>
            {isDeleteMode ? (
                <Button
                    fullWidth
                    color='danger'
                    isLoading={deleteProduct.isPending}
                    radius='full'
                    onPress={handleDelete}
                >
                    Yes, Delete
                </Button>
            ) : (
                <Button
                    fullWidth
                    className='bg-foreground text-white dark:text-black'
                    isLoading={isSubmitting}
                    radius='full'
                    onPress={() => handleSubmit(onSubmit)()}
                >
                    {isEdit ? 'Update' : 'Add'}
                </Button>
            )}
        </div>
    )

    if (isDesktop) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        {isDeleteMode ? 'Confirm Delete' : isEdit ? 'Edit Product' : 'Add Product'}
                    </ModalHeader>
                    <ModalBody className='flex flex-col gap-2'>
                        {isDeleteMode ? <DeleteText /> : <FormFields />}
                    </ModalBody>
                    <ModalFooter>
                        <FooterActions />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className='gap-4 overflow-auto p-4'>
                <DrawerTitle>
                    {isDeleteMode ? 'Confirm Delete' : isEdit ? 'Edit Product' : 'Add Product'}
                </DrawerTitle>
                {isDeleteMode ? <DeleteText /> : <FormFields />}
                <DrawerFooter className='p-0'>
                    <FooterActions />
                </DrawerFooter>
                <DrawerDescription aria-hidden />
            </DrawerContent>
        </Drawer>
    )
}
