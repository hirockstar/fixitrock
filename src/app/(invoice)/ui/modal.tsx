'use client'

import { useEffect, useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Input,
    Button,
} from '@heroui/react'

import { Invoice } from '®types/invoice'
import { useInvoice } from '®hooks/tanstack/mutation'

interface InvoiceModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Partial<Invoice>
}

export default function InvoiceModal({ isOpen, onClose, initialData }: InvoiceModalProps) {
    const { addInvoice, updateInvoice } = useInvoice()
    const isUpdate = Boolean(initialData?.id)

    const [form, setForm] = useState({
        product: '',
        seller: '',
        location: '',
    })

    useEffect(() => {
        if (initialData) {
            setForm({
                product: initialData.product || '',
                seller: initialData.seller || '',
                location: initialData.location || '',
            })
        } else {
            setForm({ product: '', seller: '', location: '' })
        }
    }, [initialData, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const generateInvoiceNumber = () => {
        const now = new Date()
        const day = now.getDate() // e.g., 6
        const month = now.getMonth() + 1 // e.g., 4
        const year = now.getFullYear() % 100 // e.g., 25

        return Number(`${day}${month}${year}`) // → 6425
    }

    const handleSubmit = () => {
        const handleSuccess = () => {
            onClose()
            setForm({ product: '', seller: '', location: '' })
        }

        if (isUpdate && initialData?.id) {
            updateInvoice.mutate({ ...form, id: initialData.id }, { onSuccess: handleSuccess })
        } else {
            const number = generateInvoiceNumber()

            addInvoice.mutate({ ...form, number }, { onSuccess: handleSuccess })
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>{isUpdate ? 'Update Invoice' : 'Add Invoice'}</ModalHeader>
                <ModalBody className='flex flex-col gap-3'>
                    <Input
                        label='Product'
                        name='product'
                        placeholder='Enter product name'
                        value={form.product}
                        onChange={handleChange}
                    />
                    <Input
                        label='Seller'
                        name='seller'
                        placeholder='Enter seller name'
                        value={form.seller}
                        onChange={handleChange}
                    />
                    <Input
                        label='Location'
                        name='location'
                        placeholder='Enter location'
                        value={form.location}
                        onChange={handleChange}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant='light' onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color='primary'
                        isLoading={isUpdate ? updateInvoice.isPending : addInvoice.isPending}
                        onPress={handleSubmit}
                    >
                        {isUpdate ? 'Update' : 'Add'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
