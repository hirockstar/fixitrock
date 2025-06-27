'use client'

import { useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Button,
    Card,
    CardBody,
    Chip,
} from '@heroui/react'
import { Trash2, AlertTriangle } from 'lucide-react'

import { deleteProduct } from '®actions/products'
import { Product } from '®types/products'

interface DeleteProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    product: Product | null
}

export default function DeleteProductModal({
    isOpen,
    onClose,
    onSuccess,
    product,
}: DeleteProductModalProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (!product) return

        setIsLoading(true)
        try {
            const result = await deleteProduct(product.id)

            if (result.success) {
                onClose()
                onSuccess?.()
            } else {
                alert(result.error || 'Failed to delete product')
            }
        } catch {
            alert('An error occurred while deleting the product')
        } finally {
            setIsLoading(false)
        }
    }

    if (!product) return null

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price)
    }

    const getStockStatus = (qty: number) => {
        if (qty === 0) return { color: 'danger' as const, text: 'Out of Stock' }
        if (qty <= 5) return { color: 'warning' as const, text: 'Low Stock' }

        return { color: 'success' as const, text: 'In Stock' }
    }

    return (
        <Modal isOpen={isOpen} size='md' onClose={onClose}>
            <ModalContent>
                <ModalHeader className='flex gap-1'>
                    <Trash2 className='h-5 w-5 text-red-500' />
                    Delete Product
                </ModalHeader>
                <ModalBody>
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 rounded-lg bg-red-50 p-3'>
                            <AlertTriangle className='h-5 w-5 text-red-500' />
                            <p className='text-sm text-red-700'>
                                Are you sure you want to delete this product? This action cannot be
                                undone.
                            </p>
                        </div>

                        <Card>
                            <CardBody className='p-4'>
                                <div className='space-y-3'>
                                    <div className='flex items-start justify-between'>
                                        <h3 className='text-lg font-semibold'>{product.name}</h3>
                                        <Chip
                                            color={getStockStatus(product.qty).color}
                                            size='sm'
                                            variant='flat'
                                        >
                                            {getStockStatus(product.qty).text}
                                        </Chip>
                                    </div>

                                    {product.description && (
                                        <p className='text-sm text-gray-600'>
                                            {product.description}
                                        </p>
                                    )}

                                    <div className='grid grid-cols-2 gap-4 text-sm'>
                                        <div>
                                            <span className='text-gray-500'>Purchase Price:</span>
                                            <p className='font-medium'>
                                                {formatPrice(product.purchase)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className='text-gray-500'>Quantity:</span>
                                            <p className='font-medium'>{product.qty}</p>
                                        </div>
                                        {product.staff_price && (
                                            <div>
                                                <span className='text-gray-500'>Staff Price:</span>
                                                <p className='font-medium'>
                                                    {formatPrice(product.staff_price)}
                                                </p>
                                            </div>
                                        )}
                                        {product.price && (
                                            <div>
                                                <span className='text-gray-500'>
                                                    Customer Price:
                                                </span>
                                                <p className='font-medium'>
                                                    {formatPrice(product.price)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex gap-2'>
                                        {product.category && (
                                            <Chip color='primary' size='sm' variant='flat'>
                                                {product.category}
                                            </Chip>
                                        )}
                                        {product.brand && (
                                            <Chip color='secondary' size='sm' variant='flat'>
                                                {product.brand}
                                            </Chip>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button isDisabled={isLoading} variant='light' onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color='danger'
                        isLoading={isLoading}
                        startContent={<Trash2 size={16} />}
                        onPress={handleDelete}
                    >
                        Delete Product
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
