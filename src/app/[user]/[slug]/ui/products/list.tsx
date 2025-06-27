'use client'

import { useState } from 'react'
import { Card, CardBody, CardFooter, Button, Image, Chip, Badge, Tooltip } from '@heroui/react'
import { Edit, Trash2, Eye, Package } from 'lucide-react'

import { Product } from '®types/products'

interface ProductsListProps {
    products: Product[]
    canManage: boolean
}

export default function ProductsList({ products, canManage }: ProductsListProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
        // TODO: Implement edit functionality
        console.log('Edit product:', product)
    }

    const handleDelete = (product: Product) => {
        // TODO: Implement delete functionality
        console.log('Delete product:', product)
    }

    const handleView = (product: Product) => {
        setSelectedProduct(product)
    }

    if (products.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
                <Package className='mb-4 h-16 w-16 text-gray-400' />
                <h3 className='mb-2 text-lg font-semibold text-gray-600'>No Products Found</h3>
                <p className='max-w-md text-gray-500'>
                    {canManage
                        ? "You haven't added any products yet. Click the + button to add your first product!"
                        : "This user hasn't added any products yet."}
                </p>
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            {/* Products Grid */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {products.map((product) => {
                    const stockStatus = getStockStatus(product.qty)
                    const mainImage =
                        Array.isArray(product.img) && product.img.length > 0
                            ? typeof product.img[0] === 'string'
                                ? product.img[0]
                                : product.img[0].url
                            : null

                    return (
                        <Card key={product.id} className='transition-shadow hover:shadow-lg'>
                            <CardBody className='p-4'>
                                {/* Product Image */}
                                <div className='relative mb-3'>
                                    <Image
                                        alt={product.name}
                                        className='h-48 w-full rounded-lg object-cover'
                                        fallbackSrc='/icons/fallback.png'
                                        src={mainImage || '/icons/fallback.png'}
                                    />
                                    <Badge
                                        className='absolute top-2 right-2'
                                        color={stockStatus.color}
                                    >
                                        {stockStatus.text}
                                    </Badge>
                                </div>

                                {/* Product Info */}
                                <div className='space-y-2'>
                                    <h3 className='line-clamp-2 text-lg font-semibold'>
                                        {product.name}
                                    </h3>

                                    {product.description && (
                                        <p className='line-clamp-2 text-sm text-gray-600'>
                                            {product.description}
                                        </p>
                                    )}

                                    {/* Category and Brand */}
                                    <div className='flex flex-wrap gap-1'>
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

                                    {/* Pricing */}
                                    <div className='space-y-1'>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-gray-600'>Purchase:</span>
                                            <span className='font-medium'>
                                                {formatPrice(product.purchase)}
                                            </span>
                                        </div>
                                        {product.staff_price && (
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-gray-600'>Staff:</span>
                                                <span className='font-medium'>
                                                    {formatPrice(product.staff_price)}
                                                </span>
                                            </div>
                                        )}
                                        {product.price && (
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-gray-600'>Customer:</span>
                                                <span className='font-medium text-green-600'>
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm text-gray-600'>Quantity:</span>
                                        <span
                                            className={`font-semibold ${
                                                product.qty === 0
                                                    ? 'text-red-600'
                                                    : product.qty <= 5
                                                      ? 'text-orange-600'
                                                      : 'text-green-600'
                                            }`}
                                        >
                                            {product.qty}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>

                            {/* Action Buttons */}
                            <CardFooter className='pt-0'>
                                <div className='flex w-full gap-2'>
                                    <Tooltip content='View Details'>
                                        <Button
                                            isIconOnly
                                            size='sm'
                                            variant='light'
                                            onPress={() => handleView(product)}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                    </Tooltip>

                                    {canManage && (
                                        <>
                                            <Tooltip content='Edit Product'>
                                                <Button
                                                    isIconOnly
                                                    color='primary'
                                                    size='sm'
                                                    variant='light'
                                                    onPress={() => handleEdit(product)}
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content='Delete Product'>
                                                <Button
                                                    isIconOnly
                                                    color='danger'
                                                    size='sm'
                                                    variant='light'
                                                    onPress={() => handleDelete(product)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </Tooltip>
                                        </>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {/* Product Count */}
            <div className='text-center text-sm text-gray-500'>
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </div>
        </div>
    )
}
