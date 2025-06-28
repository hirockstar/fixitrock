'use client'

import React, { useEffect, useRef } from 'react'
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

import { addProduct } from '®actions/products'

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

interface AddProductProps {
    isOpen: boolean
    onOpenChange: () => void
}

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className='flex items-center gap-2 py-2 select-none'>
        <div>{icon}</div>
        <h3 className='text-foreground text-sm font-semibold tracking-wide uppercase'>{title}</h3>
    </div>
)

export default function AddProduct({ isOpen, onOpenChange }: AddProductProps) {
    const [{ errors }, formAction, isLoading] = useActionState(addProduct, {
        errors: {},
    })

    const prevErrorsRef = useRef(errors)

    // Show error toast only when errors occur
    useEffect(() => {
        if (JSON.stringify(prevErrorsRef.current) !== JSON.stringify(errors)) {
            prevErrorsRef.current = errors

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
        }
    }, [errors, isLoading, onOpenChange])

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
                    <p>Add New Product</p>
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
                    <Form action={formAction} id='Add Product' validationErrors={errors}>
                        {/* Product Details */}
                        <SectionHeader icon={<Box size={16} />} title='Product Details' />
                        <Input
                            isRequired
                            errorMessage={errors?.name}
                            isInvalid={!!errors?.name}
                            label='Product Name'
                            name='name'
                            placeholder='e.g., iPhone 15 Battery'
                            size='sm'
                        />
                        <Input
                            errorMessage={errors?.compatible}
                            isInvalid={!!errors?.compatible}
                            label='Compatibility'
                            name='compatible'
                            placeholder='e.g., iPhone 15, iPhone 15 Pro'
                            size='sm'
                        />
                        <Textarea
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
                                isRequired
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
                                isRequired
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
                <ModalFooter className='flex-row-reverse border-t'>
                    <Button
                        className='w-full'
                        color='primary'
                        form='Add Product'
                        isLoading={isLoading}
                        radius='full'
                        type='submit'
                    >
                        Add Product
                    </Button>
                    <Button
                        className='w-full border'
                        radius='full'
                        variant='light'
                        onPress={onOpenChange}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
