'use client'

import React, { useEffect, useActionState } from 'react'
import { Input, Textarea, Button, Form, addToast, Image, ScrollShadow } from '@heroui/react'
import { Box, Tag, IndianRupee, X, GalleryHorizontalEnd } from 'lucide-react'
import { MdAddShoppingCart } from 'react-icons/md'
import { BiImageAdd } from 'react-icons/bi'

import { Product } from '@/types/products'
import { Brand } from '@/types/brands'
import { useImageManager } from '@/hooks/useImageManager'
import { addProduct, updateProduct } from '@/actions/user/products'
import { useMediaQuery } from '@/hooks'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/ui/drawer'
import { cn } from '@/lib/utils'

import { Combobox, ComboboxItem } from './combobox'

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

// const BrandImage = ({ brand }: { brand: Brand }) => {
//     const { src } = useBrandImg(brand)

//     return (
//         <Image
//             alt={brand.name}
//             className='rounded-lg border p-0.5'
//             height={24}
//             radius='none'
//             src={src}
//             width={24}
//         />
//     )
// }

interface AddEditProps {
    isOpen: boolean
    onClose: () => void
    mode: 'add' | 'edit'
    product?: Product | null
    brands: Brand[]
}

const Section = ({
    icon,
    title,
    children,
    className,
}: {
    icon: React.ReactNode
    title: string
    children: React.ReactNode
    className: string
}) => (
    <div className='mb-2 flex w-full flex-col space-y-4'>
        <div className='flex items-center gap-2 select-none'>
            <span>{icon}</span>
            <h3 className='text-foreground font-semibold tracking-wide uppercase'>{title}</h3>
        </div>
        <div className={cn(className)}>{children}</div>
    </div>
)

// Reusable image preview component
const ImagePreview = ({
    src,
    alt,
    onRemove,
    className = 'size-20',
}: {
    src: string
    alt: string
    onRemove: () => void
    className?: string
}) => (
    <div className='group relative shrink-0'>
        <Image
            alt={alt}
            className={`${className} border object-cover`}
            classNames={{ wrapper: `${className} object-cover` }}
            src={src}
            onClick={onRemove}
        />
        <Button
            isIconOnly
            className='absolute -top-0.5 -right-0.5 z-30 h-5 w-5 min-w-0 rounded-full p-0'
            onPress={onRemove}
        >
            <X className='size-4' />
        </Button>
    </div>
)

export default function AddEdit({ isOpen, onClose, mode, product, brands }: AddEditProps) {
    const isDesktop = useMediaQuery('(min-width: 786px)')
    const action = mode === 'add' ? addProduct : updateProduct
    const [{ errors }, formAction, isLoading] = useActionState(action, {
        errors: {},
    })
    // Use image manager hook
    const {
        images,
        existingImages,
        fileInputRef,
        handleFileSelect,
        handleRemoveImage,
        handleRemoveExistingImage,
        prepareFormData,
        fileSizeError,
    } = useImageManager({ mode, product, isOpen })

    // Simple error handling
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            // Handle image-specific errors
            if (errors.images) {
                addToast({
                    title: errors.images,
                    color: 'warning',
                })
            } else {
                // Handle general errors
                const errorMessage = errors.general || 'Please check the form fields'

                addToast({
                    title: errorMessage,
                    color: 'danger',
                })
            }
        } else if (errors && Object.keys(errors).length === 0 && !isLoading) {
            // Success - call onSuccess callback and close modal
            onClose()
        }
    }, [errors, isLoading, onClose])

    // Handle form submission
    const handleFormSubmit = async (formData: FormData) => {
        const preparedFormData = prepareFormData(formData)

        await formAction(preparedFormData)
    }

    // Dynamic content based on mode
    const Title = mode === 'add' ? 'Create Product' : 'Edit Product'
    const Description =
        mode === 'add' ? 'Create a new product entry.' : `Modify details for "${product?.name}".`

    const Submit = mode === 'add' ? 'Add Product' : 'Update Product'
    const id = mode === 'add' ? 'add-product' : 'edit-product'
    // const icon = mode === 'add' ? <CirclePlus size={20} /> : <Settings2 size={20} />

    return (
        <Drawer direction={isDesktop ? 'right' : 'bottom'} open={isOpen} onOpenChange={onClose}>
            <DrawerContent
                className='h-[70vh] data-[vaul-drawer-direction=right]:sm:max-w-md md:h-full'
                hideCloseButton={isDesktop ? true : false}
                showbar={isDesktop ? false : true}
            >
                <DrawerHeader className='border-b p-2'>
                    <DrawerTitle className=''>{Title}</DrawerTitle>
                    <DrawerDescription className='text-xs'>{Description}</DrawerDescription>
                </DrawerHeader>
                <ScrollShadow hideScrollBar>
                    <Form
                        action={handleFormSubmit}
                        className='gap-4 p-2'
                        id={id}
                        validationErrors={errors}
                    >
                        {/* Add hidden input for id if editing */}
                        {mode === 'edit' && product?.id && (
                            <input name='id' type='hidden' value={product.id} />
                        )}
                        {/* Product Images */}
                        <Section
                            className='flex w-full items-center gap-3 rounded-sm border p-2'
                            icon={<GalleryHorizontalEnd size={20} />}
                            title='Product Images'
                        >
                            {/* Existing images */}
                            {existingImages.map((url, idx) => (
                                <ImagePreview
                                    key={`existing-${idx}`}
                                    alt={`${idx + 1}`}
                                    src={url}
                                    onRemove={() => handleRemoveExistingImage(idx)}
                                />
                            ))}

                            {/* New images */}
                            {images.map((file, idx) => (
                                <ImagePreview
                                    key={`new-${idx}`}
                                    alt={`${existingImages.length + idx + 1}`}
                                    src={URL.createObjectURL(file)}
                                    onRemove={() => handleRemoveImage(idx)}
                                />
                            ))}

                            {/* Add button */}
                            {existingImages.length + images.length < 4 && (
                                <Button
                                    className='aspect-square size-20 border-2 border-dashed'
                                    variant='light'
                                    onPress={() => fileInputRef.current?.click()}
                                >
                                    <BiImageAdd className='text-muted-foreground' size={30} />
                                </Button>
                            )}
                        </Section>
                        {/* Hidden file input - no name attribute to prevent automatic form submission */}
                        <input
                            ref={fileInputRef}
                            multiple
                            accept='image/*'
                            className='hidden'
                            max={4}
                            type='file'
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />

                        {/* File size error message */}
                        {fileSizeError && (
                            <div className='text-danger mt-2 text-sm'>{fileSizeError}</div>
                        )}

                        {/* Product Details */}
                        <Section
                            className='flex w-full flex-col gap-4'
                            icon={<Box size={20} />}
                            title='Product Details'
                        >
                            <Input
                                isRequired
                                defaultValue={mode === 'edit' ? product?.name || '' : ''}
                                errorMessage={errors?.name}
                                isInvalid={!!errors?.name}
                                label='Name'
                                labelPlacement='outside'
                                name='name'
                                placeholder='iPhone 15 Battery'
                                radius='sm'
                            />
                            <Input
                                defaultValue={mode === 'edit' ? product?.compatible || '' : ''}
                                errorMessage={errors?.compatible}
                                isInvalid={!!errors?.compatible}
                                label='Compatibility'
                                labelPlacement='outside'
                                name='compatible'
                                placeholder='e.g., iPhone 15, iPhone 15 Pro'
                                radius='sm'
                            />
                            <Textarea
                                defaultValue={mode === 'edit' ? product?.description || '' : ''}
                                label='Description'
                                labelPlacement='outside'
                                minRows={2}
                                name='description'
                                placeholder='Features, specs, etc.'
                                radius='sm'
                            />
                        </Section>
                        {/* Brand &  Category */}
                        <Section
                            className='flex w-full items-center gap-4'
                            icon={<Tag size={20} />}
                            title='Brand & Category'
                        >
                            <Combobox
                                defaultSelectedKey={mode === 'edit' ? product?.brand || '' : ''}
                                errorMessage={errors?.brand}
                                isInvalid={!!errors?.brand}
                                label='Brands'
                                name='brand'
                                placeholder='Select Brand'
                            >
                                {brands.map((b: Brand) => (
                                    <ComboboxItem key={b.name} value={b.name}>
                                        {b.name}
                                    </ComboboxItem>
                                ))}
                            </Combobox>
                            <Combobox
                                defaultSelectedKey={mode === 'edit' ? product?.category || '' : ''}
                                errorMessage={errors?.brand}
                                isInvalid={!!errors?.brand}
                                label='Categories'
                                name='category'
                                placeholder='Select Category'
                            >
                                {CATEGORIES.map((c) => (
                                    <ComboboxItem key={c} value={c}>
                                        {c}
                                    </ComboboxItem>
                                ))}
                            </Combobox>
                        </Section>

                        {/* Pricing & Stock */}
                        <Section
                            className='grid w-full grid-cols-2 gap-4 pb-2 md:grid-cols-4'
                            icon={<IndianRupee size={20} />}
                            title='Pricing & Stock'
                        >
                            <Input
                                isRequired
                                defaultValue={
                                    mode === 'edit' ? product?.purchase?.toString() || '' : ''
                                }
                                errorMessage={errors?.purchase}
                                isInvalid={!!errors?.purchase}
                                label='Purchase'
                                labelPlacement='outside'
                                min='0'
                                name='purchase'
                                placeholder='200'
                                radius='sm'
                                startContent={<IndianRupee size={18} />}
                                type='number'
                            />
                            <Input
                                isRequired
                                defaultValue={
                                    mode === 'edit' ? product?.staff_price?.toString() || '' : ''
                                }
                                errorMessage={errors?.staff_price}
                                isInvalid={!!errors?.staff_price}
                                label='Staff'
                                labelPlacement='outside'
                                min='0'
                                name='staff_price'
                                placeholder='250'
                                radius='sm'
                                startContent={<IndianRupee size={18} />}
                                type='number'
                            />
                            <Input
                                isRequired
                                defaultValue={
                                    mode === 'edit' ? product?.price?.toString() || '' : ''
                                }
                                errorMessage={errors?.price}
                                isInvalid={!!errors?.price}
                                label='Selling'
                                labelPlacement='outside'
                                min='0'
                                name='price'
                                placeholder='500'
                                radius='sm'
                                startContent={<IndianRupee size={18} />}
                                type='number'
                            />
                            <Input
                                isRequired
                                defaultValue={mode === 'edit' ? product?.qty?.toString() || '' : ''}
                                errorMessage={errors?.qty}
                                isInvalid={!!errors?.qty}
                                label='Stock'
                                labelPlacement='outside'
                                min='0'
                                name='qty'
                                placeholder='0'
                                radius='sm'
                                startContent={<MdAddShoppingCart size={20} />}
                                type='number'
                            />
                        </Section>
                    </Form>
                </ScrollShadow>

                <DrawerFooter className='flex-row-reverse border-t p-2 select-none'>
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
                    <Button
                        className='w-full border'
                        radius='full'
                        variant='light'
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
