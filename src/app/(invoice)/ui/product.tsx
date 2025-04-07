'use client'

import { useEffect } from 'react'
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

import { useInvoiceProduct } from '®hooks/tanstack/mutation'
import { InvoiceProduct } from '®types/invoice'
import { logWarning } from '®lib/utils'

type ProductModalProps = {
    invoiceId: string
    isOpen: boolean
    onClose: () => void
    initialData?: InvoiceProduct | null
    onProductUpdated: () => void
}

export default function ProductModal({
    invoiceId,
    isOpen,
    onClose,
    initialData,
    onProductUpdated,
}: ProductModalProps) {
    const isEdit = !!initialData?.id
    const { addProduct, updateProduct } = useInvoiceProduct(invoiceId)

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<Omit<InvoiceProduct, 'id' | 'created_at' | 'invoice_id'>>({
        defaultValues: {
            name: '',
            qty: undefined,
            purchase_price: undefined,
            price: undefined,
        },
    })

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || '',
                qty: initialData.qty || undefined,
                purchase_price: initialData.purchase_price || undefined,
                price: initialData.price || undefined,
            })
        } else {
            reset({
                name: '',
                qty: undefined,
                purchase_price: undefined,
                price: undefined,
            })
        }
    }, [initialData, reset])

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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>{isEdit ? 'Edit Product' : 'Add Product'}</ModalHeader>
                <ModalBody className='flex flex-col gap-2'>
                    <Input label='Product Name' {...register('name', { required: true })} />
                    <Input
                        label='Quantity'
                        type='number'
                        {...register('qty', { required: true })}
                    />
                    <Input
                        label='Purchase Price'
                        type='number'
                        {...register('purchase_price', { required: true })}
                    />
                    <Input
                        label='Selling Price'
                        type='number'
                        {...register('price', { required: true })}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant='light' onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color='success'
                        isLoading={isSubmitting}
                        onPress={() => handleSubmit(onSubmit)()}
                    >
                        {isEdit ? 'Update' : 'Add'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
