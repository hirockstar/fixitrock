'use client'

import React, { useEffect } from 'react'
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
import { useActionState } from 'react'

import { addProduct, updateProduct } from '®actions/products'
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

interface AddEditProps {
    isOpen: boolean
    onOpenChange: () => void
    mode: 'add' | 'edit'
    product?: Product | null
}

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className='flex items-center gap-2 py-2 select-none'>
        <div>{icon}</div>
        <h3 className='text-foreground text-sm font-semibold tracking-wide uppercase'>{title}</h3>
    </div>
)

export default function AddEdit({ isOpen, onOpenChange, mode, product }: AddEditProps) {
    // Choose action based on mode
    const action = mode === 'add' ? addProduct : updateProduct
    const [{ errors }, formAction, isLoading] = useActionState(action, {
        errors: {},
    })

    // Simple error handling
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const errorMessage = errors.general || 'Please check the form fields'

            addToast({
                title: 'Error',
                description: errorMessage,
                color: 'danger',
            })
        } else if (errors && Object.keys(errors).length === 0 && !isLoading) {
            // Success - just close modal
            onOpenChange()
        }
    }, [errors, isLoading, onOpenChange])

    // Dynamic content based on mode
    const Title = mode === 'add' ? 'Add New Product' : 'Edit Product'
    const Submit = mode === 'add' ? 'Add Product' : 'Update Product'
    const id = mode === 'add' ? 'add-product' : 'edit-product'

    return (
        <Modal
            hideCloseButton
            className='border'
            isOpen={isOpen}
            placement='center'
            scrollBehavior='inside'
            size='2xl'
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                <ModalHeader className='flex-1 items-center justify-between border-b select-none'>
                    <p>{Title}</p>
                    <Button
                        isIconOnly
                        className='border'
                        radius='full'
                        size='sm'
                        startContent={<X size={18} />}
                        variant='light'
                        onPress={onOpenChange}
                    />
                </ModalHeader>
                <ModalBody>
                    <Form action={formAction} id={id} validationErrors={errors}>
                        {/* Hidden product ID for edit mode */}
                        {mode === 'edit' && product && (
                            <input name='id' type='hidden' value={product.id} />
                        )}

                        {/* Product Details */}
                        <SectionHeader icon={<Box size={16} />} title='Product Details' />
                        <Input
                            isRequired
                            defaultValue={mode === 'edit' ? product?.name || '' : ''}
                            errorMessage={errors?.name}
                            isInvalid={!!errors?.name}
                            label='Product Name'
                            name='name'
                            placeholder='e.g., iPhone 15 Battery'
                            size='sm'
                        />
                        <Input
                            defaultValue={mode === 'edit' ? product?.compatible || '' : ''}
                            errorMessage={errors?.compatible}
                            isInvalid={!!errors?.compatible}
                            label='Compatibility'
                            name='compatible'
                            placeholder='e.g., iPhone 15, iPhone 15 Pro'
                            size='sm'
                        />
                        <Textarea
                            defaultValue={mode === 'edit' ? product?.description || '' : ''}
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
                                isRequired
                                defaultSelectedKey={mode === 'edit' ? product?.category || '' : ''}
                                errorMessage={errors?.category}
                                isInvalid={!!errors?.category}
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
                                isRequired
                                defaultSelectedKey={mode === 'edit' ? product?.brand || '' : ''}
                                errorMessage={errors?.brand}
                                isInvalid={!!errors?.brand}
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
                                defaultValue={
                                    mode === 'edit' ? product?.purchase?.toString() || '' : ''
                                }
                                errorMessage={errors?.purchase}
                                isInvalid={!!errors?.purchase}
                                label='Purchase Price'
                                min='0'
                                name='purchase'
                                placeholder='₹0'
                                size='sm'
                                type='number'
                            />
                            <Input
                                defaultValue={
                                    mode === 'edit' ? product?.staff_price?.toString() || '' : ''
                                }
                                errorMessage={errors?.staff_price}
                                isInvalid={!!errors?.staff_price}
                                label='Staff Price'
                                min='0'
                                name='staff_price'
                                placeholder='₹0'
                                size='sm'
                                type='number'
                            />
                            <Input
                                defaultValue={
                                    mode === 'edit' ? product?.price?.toString() || '' : ''
                                }
                                errorMessage={errors?.price}
                                isInvalid={!!errors?.price}
                                label='Customer Price'
                                min='0'
                                name='price'
                                placeholder='₹0'
                                size='sm'
                                type='number'
                            />
                            <Input
                                isRequired
                                defaultValue={mode === 'edit' ? product?.qty?.toString() || '' : ''}
                                errorMessage={errors?.qty}
                                isInvalid={!!errors?.qty}
                                label='Quantity'
                                min='0'
                                name='qty'
                                placeholder='0'
                                size='sm'
                                type='number'
                            />
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter className='border-t'>
                    <Button
                        className='w-full border'
                        radius='full'
                        variant='light'
                        onPress={onOpenChange}
                    >
                        Cancel
                    </Button>
                    <Button
                        className='w-full'
                        color='primary'
                        form={id}
                        isLoading={isLoading}
                        radius='full'
                        type='submit'
                    >
                        {Submit}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
