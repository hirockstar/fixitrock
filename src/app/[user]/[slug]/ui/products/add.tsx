'use client'

import React, { useEffect, useActionState } from 'react'
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
    Image,
} from '@heroui/react'
import { Box, Tag, IndianRupee, X, GalleryHorizontalEnd, Settings2, CirclePlus } from 'lucide-react'
import { MdAddShoppingCart } from 'react-icons/md'
import { BiImageAdd } from 'react-icons/bi'

import { Product } from '®types/products'
import { Brand } from '®types/brands'
import { useImageManager } from '®hooks/useImageManager'
import { addProduct, updateProduct } from '®actions/user/products'

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

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className='flex items-center gap-2 py-2 select-none'>
        <span>{icon}</span>
        <h3 className='text-foreground font-semibold tracking-wide uppercase'>{title}</h3>
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
    // Choose action based on mode
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
    const Title = mode === 'add' ? 'Add Product' : 'Edit Product'
    const Submit = mode === 'add' ? 'Add Product' : 'Update Product'
    const id = mode === 'add' ? 'add-product' : 'edit-product'
    const icon = mode === 'add' ? <CirclePlus size={20} /> : <Settings2 size={20} />

    return (
        <Modal
            hideCloseButton
            className='border dark:bg-[#0a0a0a]'
            isOpen={isOpen}
            placement='center'
            scrollBehavior='inside'
            size='2xl'
            onClose={onClose}
        >
            <ModalContent className='overflow-hidden'>
                <ModalHeader className='flex-1 items-center justify-between border-b bg-gray-50 select-none dark:bg-zinc-900'>
                    <p className='flex items-center gap-2'>
                        {icon} {Title}
                    </p>
                    <Button
                        isIconOnly
                        className='border'
                        radius='full'
                        size='sm'
                        startContent={<X size={18} />}
                        variant='light'
                        onPress={onClose}
                    />
                </ModalHeader>
                <ModalBody>
                    <Form
                        action={handleFormSubmit}
                        className='gap-4'
                        id={id}
                        validationErrors={errors}
                    >
                        {/* Add hidden input for id if editing */}
                        {mode === 'edit' && product?.id && (
                            <input name='id' type='hidden' value={product.id} />
                        )}
                        {/* Product Images */}
                        <SectionHeader
                            icon={<GalleryHorizontalEnd size={20} />}
                            title='Product Images'
                        />
                        <div className='flex w-full items-center gap-3 rounded-sm border p-2'>
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
                        </div>
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
                        <SectionHeader icon={<Box size={20} />} title='Product Details' />
                        <div className='flex w-full flex-col gap-4'>
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
                        </div>
                        {/* Category & Brand */}
                        <SectionHeader icon={<Tag size={20} />} title='Category & Brand' />
                        <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
                            <Autocomplete
                                isRequired
                                defaultSelectedKey={mode === 'edit' ? product?.category || '' : ''}
                                errorMessage={errors?.category}
                                isInvalid={!!errors?.category}
                                label='Category'
                                labelPlacement='outside'
                                name='category'
                                placeholder='Choose category'
                                radius='sm'
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
                                labelPlacement='outside'
                                name='brand'
                                placeholder='Choose brand'
                                radius='sm'
                            >
                                {brands.map((b: Brand) => (
                                    <AutocompleteItem
                                        key={b.name}
                                        // startContent={<BrandImage brand={b} />}
                                    >
                                        {b.name}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>

                        {/* Pricing & Stock */}
                        <SectionHeader icon={<IndianRupee size={20} />} title='Pricing & Stock' />
                        <div className='grid w-full grid-cols-2 gap-4 pb-2 md:grid-cols-4'>
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
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter className='flex-row-reverse border-t bg-gray-50 select-none dark:bg-zinc-900'>
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
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
