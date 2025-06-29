'use client'

import { useState } from 'react'
import { Card, CardBody, CardFooter, Button, Image, Chip, useDisclosure } from '@heroui/react'
import { Edit, Trash2, Eye, Plus } from 'lucide-react'

import { Product } from '®types/products'
import { logWarning } from '®lib/utils'

import DeleteProductModal from './delete'
import AddEdit from './add'

interface ProductsListProps {
    products: Product[]
    canManage: boolean
}

export default function ProductsList({ products, canManage }: ProductsListProps) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

    // Use useDisclosure for all modals
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure({ defaultOpen: false })
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure({ defaultOpen: false })
    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onClose: onAddClose,
    } = useDisclosure({ defaultOpen: false })

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

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        onEditOpen()
    }

    const handleDelete = (product: Product) => {
        setDeletingProduct(product)
        onDeleteOpen()
    }

    const handleView = (product: Product) => {
        // TODO: Implement view functionality
        logWarning('View product:', product)
    }

    const handleAddProduct = () => {
        onAddOpen()
    }

    const handleDeleteSuccess = () => {
        onDeleteClose()
        setDeletingProduct(null)
        // Refresh the page to show updated data
        window.location.reload()
    }

    const handleCloseDelete = () => {
        onDeleteClose()
        setDeletingProduct(null)
    }

    if (products.length === 0) {
        return (
            <>
                <div className='flex flex-col items-center justify-center py-12'>
                    <div className='text-center'>
                        <div className='mx-auto h-12 w-12 text-gray-400'>
                            <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path
                                    d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                />
                            </svg>
                        </div>
                        <h3 className='mt-2 text-sm font-medium text-gray-900'>No products</h3>
                        <p className='mt-1 text-sm text-gray-500'>
                            Get started by creating a new product.
                        </p>
                        {canManage && (
                            <div className='mt-6'>
                                <Button
                                    color='primary'
                                    startContent={<Plus size={16} />}
                                    onPress={handleAddProduct}
                                >
                                    Add Product
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <AddEdit isOpen={isAddOpen} mode='add' onClose={onAddClose} />
            </>
        )
    }

    return (
        <>
            <div className='space-y-6'>
                {/* Products Grid */}
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {products.map((product) => (
                        <Card key={product.id} className='overflow-hidden'>
                            <CardBody className='p-0'>
                                {/* Product Image */}
                                <div className='aspect-square overflow-hidden'>
                                    {product.img && product.img.length > 0 ? (
                                        <Image
                                            alt={product.name}
                                            className='h-full w-full object-cover'
                                            fallbackSrc='/icons/fallback.png'
                                            src={
                                                typeof product.img[0] === 'string'
                                                    ? product.img[0]
                                                    : product.img[0].url
                                            }
                                        />
                                    ) : (
                                        <div className='flex h-full w-full items-center justify-center bg-gray-100'>
                                            <svg
                                                className='h-12 w-12 text-gray-400'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className='p-4'>
                                    <div className='flex items-start justify-between'>
                                        <h3 className='line-clamp-2 text-sm font-semibold'>
                                            {product.name}
                                        </h3>
                                        <Chip
                                            color={getStockStatus(product.qty).color}
                                            size='sm'
                                            variant='flat'
                                        >
                                            {getStockStatus(product.qty).text}
                                        </Chip>
                                    </div>

                                    {product.description && (
                                        <p className='mt-1 line-clamp-2 text-xs text-gray-600'>
                                            {product.description}
                                        </p>
                                    )}

                                    <div className='mt-2 space-y-1'>
                                        <div className='flex justify-between text-xs'>
                                            <span className='text-gray-500'>Purchase:</span>
                                            <span className='font-medium'>
                                                {formatPrice(product.purchase)}
                                            </span>
                                        </div>
                                        {product.staff_price && (
                                            <div className='flex justify-between text-xs'>
                                                <span className='text-gray-500'>Staff:</span>
                                                <span className='font-medium'>
                                                    {formatPrice(product.staff_price)}
                                                </span>
                                            </div>
                                        )}
                                        {product.price && (
                                            <div className='flex justify-between text-xs'>
                                                <span className='text-gray-500'>Customer:</span>
                                                <span className='font-medium'>
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className='mt-2 flex gap-1'>
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

                            {/* Action Buttons */}
                            <CardFooter className='p-4 pt-0'>
                                <div className='flex w-full gap-2'>
                                    <Button
                                        className='flex-1'
                                        size='sm'
                                        variant='flat'
                                        onPress={() => handleView(product)}
                                    >
                                        <Eye size={14} />
                                        View
                                    </Button>
                                    {canManage && (
                                        <>
                                            <Button
                                                isIconOnly
                                                color='primary'
                                                size='sm'
                                                variant='flat'
                                                onPress={() => handleEdit(product)}
                                            >
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                color='danger'
                                                size='sm'
                                                variant='flat'
                                                onPress={() => handleDelete(product)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            <AddEdit
                isOpen={isEditOpen}
                mode='edit'
                product={editingProduct}
                onClose={onEditClose}
            />

            {/* Delete Modal */}
            <DeleteProductModal
                isOpen={isDeleteOpen}
                product={deletingProduct}
                onClose={handleCloseDelete}
                onSuccess={handleDeleteSuccess}
            />

            {/* Add Product Modal */}
            <AddEdit isOpen={isAddOpen} mode='add' onClose={onAddClose} />
        </>
    )
}
