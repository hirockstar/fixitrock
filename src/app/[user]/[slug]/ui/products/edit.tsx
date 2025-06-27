'use client'

import { useEffect, useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Input,
    Button,
    Textarea,
    Select,
    SelectItem,
    Chip,
    Form,
} from '@heroui/react'
import { Plus, X } from 'lucide-react'

import { updateProduct } from '®actions/products'
import { Product } from '®types/products'

// Predefined categories for better UX
const CATEGORIES = [
    'battery',
    'display',
    'camera',
    'speaker',
    'charger',
    'cable',
    'case',
    'screen protector',
    'other',
]

// Predefined brands for better UX
const BRANDS = [
    'Apple',
    'Samsung',
    'Xiaomi',
    'OnePlus',
    'Google',
    'Huawei',
    'Oppo',
    'Vivo',
    'Realme',
    'Other',
]

interface EditProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    product: Product | null
}

export default function EditProductModal({
    isOpen,
    onClose,
    onSuccess,
    product,
}: EditProductModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [newImageUrl, setNewImageUrl] = useState('')
    const [images, setImages] = useState<string[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Populate form when product changes
    useEffect(() => {
        if (product && isOpen) {
            setImages(
                Array.isArray(product.img)
                    ? product.img.map((img) => (typeof img === 'string' ? img : img.url))
                    : []
            )
            setNewImageUrl('')
            setErrors({})
        }
    }, [product, isOpen])

    const addImage = () => {
        if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
            setImages([...images, newImageUrl.trim()])
            setNewImageUrl('')
        }
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const validateForm = (formData: FormData) => {
        const newErrors: Record<string, string> = {}

        const name = formData.get('name') as string
        const purchase = formData.get('purchase') as string
        const qty = formData.get('qty') as string

        if (!name?.trim()) {
            newErrors.name = 'Product name is required'
        }

        if (!purchase || parseFloat(purchase) <= 0) {
            newErrors.purchase = 'Purchase price must be greater than 0'
        }

        if (!qty || parseInt(qty) < 0) {
            newErrors.qty = 'Quantity must be 0 or greater'
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (!product) return

        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        if (!validateForm(formData)) {
            return
        }

        setIsLoading(true)
        try {
            const result = await updateProduct({
                id: product.id,
                name: formData.get('name') as string,
                description: (formData.get('description') as string) || undefined,
                purchase: parseFloat(formData.get('purchase') as string),
                staff_price: formData.get('staff_price')
                    ? parseFloat(formData.get('staff_price') as string)
                    : undefined,
                price: formData.get('price')
                    ? parseFloat(formData.get('price') as string)
                    : undefined,
                qty: parseInt(formData.get('qty') as string),
                category: (formData.get('category') as string) || undefined,
                brand: (formData.get('brand') as string) || undefined,
                img: images.length > 0 ? images : undefined,
                other: product.other || {},
            })

            if (result.success) {
                onClose()
                onSuccess?.()
            } else {
                setErrors({ submit: result.error || 'Failed to update product' })
            }
        } catch {
            setErrors({ submit: 'An error occurred while updating the product' })
        } finally {
            setIsLoading(false)
        }
    }

    if (!product) return null

    return (
        <Modal isOpen={isOpen} size='2xl' onClose={onClose}>
            <ModalContent>
                <ModalHeader>Edit Product</ModalHeader>
                <ModalBody className='flex max-h-[70vh] flex-col gap-4 overflow-y-auto'>
                    <Form className='space-y-6' validationErrors={errors} onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className='space-y-3'>
                            <h3 className='text-sm font-semibold text-gray-600'>
                                Basic Information
                            </h3>
                            <Input
                                isClearable
                                isRequired
                                defaultValue={product.name}
                                errorMessage={errors.name}
                                isInvalid={!!errors.name}
                                label='Product Name *'
                                name='name'
                                placeholder='e.g., iPhone 15 Battery'
                                variant='bordered'
                            />
                            <Textarea
                                defaultValue={product.description || ''}
                                label='Description'
                                minRows={2}
                                name='description'
                                placeholder='Product description...'
                                variant='bordered'
                            />
                        </div>

                        {/* Pricing */}
                        <div className='space-y-3'>
                            <h3 className='text-sm font-semibold text-gray-600'>Pricing</h3>
                            <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                                <Input
                                    isRequired
                                    defaultValue={product.purchase.toString()}
                                    errorMessage={errors.purchase}
                                    isInvalid={!!errors.purchase}
                                    label='Purchase Price *'
                                    min='0'
                                    name='purchase'
                                    placeholder='0.00'
                                    startContent={<span className='text-gray-500'>₹</span>}
                                    step='0.01'
                                    type='number'
                                    variant='bordered'
                                />
                                <Input
                                    defaultValue={product.staff_price?.toString() || ''}
                                    label='Staff Price'
                                    min='0'
                                    name='staff_price'
                                    placeholder='0.00'
                                    startContent={<span className='text-gray-500'>₹</span>}
                                    step='0.01'
                                    type='number'
                                    variant='bordered'
                                />
                                <Input
                                    defaultValue={product.price?.toString() || ''}
                                    label='Customer Price'
                                    min='0'
                                    name='price'
                                    placeholder='0.00'
                                    startContent={<span className='text-gray-500'>₹</span>}
                                    step='0.01'
                                    type='number'
                                    variant='bordered'
                                />
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className='space-y-3'>
                            <h3 className='text-sm font-semibold text-gray-600'>Inventory</h3>
                            <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                                <Input
                                    isRequired
                                    defaultValue={product.qty.toString()}
                                    errorMessage={errors.qty}
                                    isInvalid={!!errors.qty}
                                    label='Quantity *'
                                    min='0'
                                    name='qty'
                                    placeholder='0'
                                    type='number'
                                    variant='bordered'
                                />
                                <Select
                                    defaultSelectedKeys={product.category ? [product.category] : []}
                                    label='Category'
                                    name='category'
                                    placeholder='Select category'
                                    variant='bordered'
                                >
                                    {CATEGORIES.map((category) => (
                                        <SelectItem key={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    defaultSelectedKeys={product.brand ? [product.brand] : []}
                                    label='Brand'
                                    name='brand'
                                    placeholder='Select brand'
                                    variant='bordered'
                                >
                                    {BRANDS.map((brand) => (
                                        <SelectItem key={brand}>{brand}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Images */}
                        <div className='space-y-3'>
                            <h3 className='text-sm font-semibold text-gray-600'>Product Images</h3>
                            <div className='flex gap-2'>
                                <Input
                                    className='flex-1'
                                    placeholder='Image URL'
                                    value={newImageUrl}
                                    variant='bordered'
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addImage()}
                                />
                                <Button
                                    isIconOnly
                                    color='primary'
                                    isDisabled={!newImageUrl.trim()}
                                    variant='flat'
                                    onPress={addImage}
                                >
                                    <Plus size={16} />
                                </Button>
                            </div>

                            {images.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {images.map((url, index) => (
                                        <Chip
                                            key={index}
                                            endContent={<X size={14} />}
                                            variant='flat'
                                            onClose={() => removeImage(index)}
                                        >
                                            {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                                        </Chip>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {errors.submit && (
                            <div className='rounded-lg border border-red-200 bg-red-50 p-3'>
                                <p className='text-sm text-red-700'>{errors.submit}</p>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className='flex justify-end gap-2'>
                            <Button
                                isDisabled={isLoading}
                                type='button'
                                variant='light'
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button color='primary' isLoading={isLoading} type='submit'>
                                Update Product
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
