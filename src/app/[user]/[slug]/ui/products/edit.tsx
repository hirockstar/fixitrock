'use client'

import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Input,
    Textarea,
    Button,
    Autocomplete,
    AutocompleteItem,
    Form,
    addToast,
} from '@heroui/react'
import { Box, Tag, IndianRupee, X } from 'lucide-react'

import { updateProduct } from '®actions/products'
import { Product } from '®types/products'

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

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className='flex items-center gap-2 py-2 select-none'>
        <div>{icon}</div>
        <h3 className='text-foreground text-sm font-semibold tracking-wide uppercase'>{title}</h3>
    </div>
)

export default function EditProductModal({
    isOpen,
    onClose,
    onSuccess,
    product,
}: EditProductModalProps) {
    const [formValues, setFormValues] = useState({
        name: '',
        purchase: '',
        qty: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    // Populate form when product changes
    useEffect(() => {
        if (product && isOpen) {
            setFormValues({
                name: product.name || '',
                purchase: product.purchase?.toString() || '',
                qty: product.qty?.toString() || '',
            })
            setErrors({})
        }
    }, [product, isOpen])

    // Check if all required fields are filled
    const isFormValid = () => {
        return (
            formValues.name.trim() !== '' &&
            formValues.purchase.trim() !== '' &&
            parseFloat(formValues.purchase) > 0 &&
            formValues.qty.trim() !== '' &&
            parseInt(formValues.qty) >= 0
        )
    }

    const handleFieldChange = (field: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }))
    }

    const validateForm = (formData: FormData) => {
        const newErrors: Record<string, string> = {}

        if (!formData.get('name')?.toString().trim()) newErrors.name = 'Name is required'
        if (!formData.get('purchase') || parseFloat(formData.get('purchase') as string) <= 0)
            newErrors.purchase = 'Must be > 0'
        if (!formData.get('qty') || parseInt(formData.get('qty') as string) < 0)
            newErrors.qty = 'Must be ≥ 0'

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (!product) return

        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        if (!validateForm(formData)) {
            addToast({
                title: 'Validation Error',
                description: Object.values(errors).join(', ') || 'Please fill all required fields',
                color: 'danger',
            })

            return
        }

        setIsLoading(true)
        try {
            const result = await updateProduct({
                id: product.id,
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                purchase: parseFloat(formData.get('purchase') as string),
                staff_price: formData.get('staff_price')
                    ? parseFloat(formData.get('staff_price') as string)
                    : undefined,
                price: formData.get('price')
                    ? parseFloat(formData.get('price') as string)
                    : undefined,
                qty: parseInt(formData.get('qty') as string),
                category: formData.get('category') as string,
                brand: formData.get('brand') as string,
                img: product.img,
                other: product.other || {},
            })

            if (result.success) {
                addToast({ title: 'Product Updated', description: 'Success!', color: 'success' })
                onClose()
                onSuccess?.()
            } else {
                addToast({
                    title: 'Failed',
                    description: result.error || 'Try again.',
                    color: 'danger',
                })
            }
        } catch {
            addToast({ title: 'Error', description: 'Something went wrong', color: 'danger' })
        } finally {
            setIsLoading(false)
        }
    }

    if (!product) return null

    return (
        <Modal
            hideCloseButton
            className='border'
            isOpen={isOpen}
            placement='center'
            scrollBehavior='inside'
            size='2xl'
            onClose={onClose}
        >
            <ModalContent>
                <ModalHeader className='flex-1 items-center justify-between border-b select-none'>
                    <p>Edit Product</p>
                    <Button
                        isIconOnly
                        className='border'
                        isDisabled={isLoading}
                        radius='full'
                        size='sm'
                        startContent={<X size={18} />}
                        variant='light'
                        onPress={onClose}
                    />
                </ModalHeader>
                <ModalBody className=''>
                    <Form validationErrors={errors} onSubmit={handleSubmit}>
                        {/* Product Details */}
                        <SectionHeader icon={<Box size={16} />} title='Product Details' />
                        <Input
                            isRequired
                            errorMessage={errors.name}
                            isInvalid={!!errors.name}
                            label='Product Name'
                            name='name'
                            placeholder='e.g., iPhone 15 Battery'
                            size='sm'
                            value={formValues.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                        />
                        <Textarea
                            defaultValue={product.description || ''}
                            label='Description'
                            minRows={2}
                            name='description'
                            placeholder='Features, specs, etc.'
                            size='sm'
                        />

                        {/* Category & Brand */}
                        <SectionHeader icon={<Tag size={16} />} title='Category & Brand' />
                        <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
                            <Autocomplete
                                defaultSelectedKey={product.category || ''}
                                label='Category'
                                name='category'
                                placeholder='Choose category'
                                size='sm'
                            >
                                {CATEGORIES.map((c) => (
                                    <AutocompleteItem key={c}>{c}</AutocompleteItem>
                                ))}
                            </Autocomplete>
                            <Autocomplete
                                defaultSelectedKey={product.brand || ''}
                                label='Brand'
                                name='brand'
                                placeholder='Choose brand'
                                size='sm'
                            >
                                {BRANDS.map((b) => (
                                    <AutocompleteItem key={b}>{b}</AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>

                        {/* Pricing & Stock */}
                        <SectionHeader icon={<IndianRupee size={16} />} title='Pricing & Stock' />
                        <div className='grid grid-cols-2 gap-4 pb-2 sm:grid-cols-4'>
                            <Input
                                isRequired
                                errorMessage={errors.purchase}
                                isInvalid={!!errors.purchase}
                                label='Purchase Price'
                                min='0'
                                name='purchase'
                                placeholder='₹0'
                                size='sm'
                                type='number'
                                value={formValues.purchase}
                                onChange={(e) => handleFieldChange('purchase', e.target.value)}
                            />
                            <Input
                                defaultValue={product.staff_price?.toString() || ''}
                                label='Staff Price'
                                min='0'
                                name='staff_price'
                                placeholder='₹0'
                                size='sm'
                                type='number'
                            />
                            <Input
                                defaultValue={product.price?.toString() || ''}
                                label='Customer Price'
                                min='0'
                                name='price'
                                placeholder='₹0'
                                size='sm'
                                type='number'
                            />
                            <Input
                                isRequired
                                errorMessage={errors.qty}
                                isInvalid={!!errors.qty}
                                label='Quantity'
                                min='0'
                                name='qty'
                                placeholder='0'
                                size='sm'
                                type='number'
                                value={formValues.qty}
                                onChange={(e) => handleFieldChange('qty', e.target.value)}
                            />
                        </div>

                        {/* Images - Commented out for now */}
                        {/* <SectionHeader icon={<ImagePlus size={16} />} title='Product Images' />
                        <div className='flex w-full items-center gap-2'>
                            <Input
                                className='flex-1'
                                placeholder='Paste image URL'
                                size='sm'
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addImage()}
                            />
                            <Button
                                isIconOnly
                                color='secondary'
                                isDisabled={!newImageUrl.trim()}
                                size='sm'
                                variant='flat'
                                onPress={addImage}
                            >
                                <Plus size={16} />
                            </Button>
                        </div>

                        {images.length > 0 && (
                            <div className='mt-3 flex flex-wrap gap-3'>
                                {images.map((url, idx) => (
                                    <div
                                        key={idx}
                                        className='group relative h-[64px] w-[64px] overflow-hidden rounded border'
                                    >
                                        <img
                                            alt='Product'
                                            className='h-full w-full object-cover'
                                            src={url}
                                        />
                                        <Button
                                            className='bg-opacity-50 absolute top-0 right-0 rounded-bl bg-black p-0.5 text-white'
                                            type='button'
                                            onPress={() => removeImage(idx)}
                                        >
                                            <X size={12} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )} */}
                    </Form>
                </ModalBody>
                <ModalFooter className='border-t'>
                    <Button
                        className='w-full border'
                        isDisabled={isLoading}
                        radius='full'
                        variant='light'
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className='w-full'
                        color='primary'
                        isDisabled={isLoading || !isFormValid()}
                        isLoading={isLoading}
                        radius='full'
                        type='submit'
                    >
                        Update Product
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
