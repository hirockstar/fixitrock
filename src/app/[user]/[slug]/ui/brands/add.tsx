'use client'

import React, { useEffect, useActionState, useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Input,
    Textarea,
    Button,
    Form,
    addToast,
    Image,
    ModalFooter,
} from '@heroui/react'
import { X, CirclePlus, Settings2 } from 'lucide-react'
import { FaAward } from 'react-icons/fa6'
import { FaLink } from 'react-icons/fa'

import { addBrand, editBrand } from '®actions/brands'
import { Brand } from '®types/brands'

interface AddEditProps {
    isOpen: boolean
    onClose: () => void
    mode: 'add' | 'edit'
    brand?: Brand | null
}

// Helper component for image preview
const ImagePreview = ({
    src,
    alt,
    onRemove,
    mode,
}: {
    src: string
    alt: string
    onRemove: () => void
    mode: 'light' | 'dark'
}) => (
    <div
        className={`group relative flex w-full flex-col rounded-lg border p-3 ${
            mode === 'light' ? 'bg-white' : 'bg-black'
        }`}
    >
        <span
            className={`mb-2 text-sm font-semibold tracking-wide uppercase ${
                mode === 'light' ? 'text-blue-600' : 'text-purple-300'
            }`}
        >
            {mode === 'light' ? 'Light' : 'Dark'} Logo Preview
        </span>
        <div className='flex w-full items-center justify-center'>
            <div className='border-muted-foreground relative size-24 rounded-lg border-2 border-dashed p-2'>
                <Image
                    alt={alt}
                    className='mx-auto items-center rounded-md object-contain'
                    height={80}
                    src={src || '/fallback.png'}
                    width={80}
                />
                <Button
                    isIconOnly
                    aria-label='Remove image'
                    className='absolute -top-0.5 -right-0.5 z-30 h-5 w-5 min-w-0 rounded-full p-0 opacity-0 group-hover:opacity-100'
                    onPress={onRemove}
                >
                    <X className='size-4' />
                </Button>
            </div>
        </div>
    </div>
)

export default function AddEdit({ isOpen, onClose, mode, brand }: AddEditProps) {
    // Choose action based on mode
    const action = mode === 'add' ? addBrand : editBrand
    const [state, formAction, isLoading] = useActionState(action, {
        errors: {},
    })

    // Image states
    const [lightLogoUrl, setLightLogoUrl] = useState('')
    const [darkLogoUrl, setDarkLogoUrl] = useState('')
    const [existingLightLogo, setExistingLightLogo] = useState('')
    const [existingDarkLogo, setExistingDarkLogo] = useState('')
    const [deletedLightLogo, setDeletedLightLogo] = useState(false)
    const [deletedDarkLogo, setDeletedDarkLogo] = useState(false)

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            // Reset all states when modal closes
            setLightLogoUrl('')
            setDarkLogoUrl('')
            setExistingLightLogo('')
            setExistingDarkLogo('')
            setDeletedLightLogo(false)
            setDeletedDarkLogo(false)
        } else if (mode === 'edit' && brand) {
            // Set existing logos when editing
            setExistingLightLogo(brand.logo?.light || '')
            setExistingDarkLogo(brand.logo?.dark || '')
            setLightLogoUrl('')
            setDarkLogoUrl('')
            setDeletedLightLogo(false)
            setDeletedDarkLogo(false)
        } else if (mode === 'add') {
            // Clear everything when adding new brand
            setLightLogoUrl('')
            setDarkLogoUrl('')
            setExistingLightLogo('')
            setExistingDarkLogo('')
            setDeletedLightLogo(false)
            setDeletedDarkLogo(false)
        }
    }, [isOpen, mode, brand])

    // Error handling and success detection
    useEffect(() => {
        if (state?.errors && Object.keys(state.errors).length > 0) {
            const errorMessage = state.errors.general || 'Please check the form fields'

            addToast({
                title: errorMessage,
                color: 'danger',
            })
        } else if (!isLoading && state?.success) {
            // Success - close modal and show success toast
            addToast({
                title:
                    state.message ||
                    (mode === 'add' ? 'Brand added successfully!' : 'Brand updated successfully!'),
                color: 'success',
            })
            onClose()
        }
    }, [state, isLoading, onClose, mode])

    // Handle form submission
    const handleFormSubmit = async (formData: FormData) => {
        // Only append logo_light if not deleted
        if (!deletedLightLogo) {
            if (lightLogoUrl) {
                formData.append('logo_light', lightLogoUrl)
            } else if (existingLightLogo) {
                formData.append('logo_light', existingLightLogo)
            }
        }
        // Only append logo_dark if not deleted
        if (!deletedDarkLogo) {
            if (darkLogoUrl) {
                formData.append('logo_dark', darkLogoUrl)
            } else if (existingDarkLogo) {
                formData.append('logo_dark', existingDarkLogo)
            }
        }
        // Add deletion flags
        if (deletedLightLogo) {
            formData.append('delete_light_logo', 'true')
        }
        if (deletedDarkLogo) {
            formData.append('delete_dark_logo', 'true')
        }
        await formAction(formData)
    }

    // Dynamic content based on mode
    const Title = mode === 'add' ? 'Add Brand' : 'Edit Brand'
    const Submit = mode === 'add' ? 'Add Brand' : 'Update Brand'
    const id = mode === 'add' ? 'add-brand' : 'edit-brand'
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
            <Form action={handleFormSubmit} id={id} validationErrors={state?.errors}>
                <ModalContent className='overflow-hidden'>
                    <ModalHeader className='flex-1 items-center justify-between rounded-t-xl border-b bg-gray-50 select-none dark:bg-zinc-900'>
                        <p className='flex items-center gap-2 text-lg font-semibold'>
                            {icon} {Title}
                        </p>
                        <Button
                            isIconOnly
                            aria-label='Close modal'
                            className='border'
                            radius='full'
                            size='sm'
                            startContent={<X size={18} />}
                            variant='light'
                            onPress={onClose}
                        />
                    </ModalHeader>
                    <ModalBody className='gap-4 py-4'>
                        {/* Add hidden input for id if editing */}
                        {mode === 'edit' && brand?.id && (
                            <input name='id' type='hidden' value={brand.id} />
                        )}
                        <Input
                            autoFocus
                            isRequired
                            defaultValue={mode === 'edit' ? brand?.name || '' : ''}
                            errorMessage={state?.errors?.name}
                            isInvalid={!!state?.errors?.name}
                            label='Brand Name'
                            labelPlacement='outside'
                            name='name'
                            placeholder='Apple'
                            radius='sm'
                            startContent={<FaAward />}
                        />
                        <Textarea
                            defaultValue={mode === 'edit' ? brand?.description || '' : ''}
                            errorMessage={state?.errors?.description}
                            isInvalid={!!state?.errors?.description}
                            label='Description'
                            labelPlacement='outside'
                            minRows={2}
                            name='description'
                            placeholder='Brand description, features, etc.'
                            radius='sm'
                        />

                        <Input
                            errorMessage={state?.errors?.logo_light}
                            id='logo_light'
                            isInvalid={!!state?.errors?.logo_light}
                            label='Light Mode Logo URL'
                            labelPlacement='outside'
                            placeholder='https://example.com/logo-light.svg'
                            radius='sm'
                            startContent={<FaLink />}
                            value={lightLogoUrl}
                            onChange={(e) => setLightLogoUrl(e.target.value)}
                        />
                        {(lightLogoUrl || (existingLightLogo && !deletedLightLogo)) && (
                            <ImagePreview
                                alt='Light Logo'
                                mode='light'
                                src={lightLogoUrl || existingLightLogo}
                                onRemove={() => {
                                    setLightLogoUrl('')
                                    if (existingLightLogo) {
                                        setDeletedLightLogo(true)
                                    }
                                    setExistingLightLogo('')
                                }}
                            />
                        )}

                        <Input
                            errorMessage={state?.errors?.logo_dark}
                            id='logo_dark'
                            isInvalid={!!state?.errors?.logo_dark}
                            label='Dark Mode Logo URL'
                            labelPlacement='outside'
                            placeholder='https://example.com/logo-dark.svg'
                            radius='sm'
                            startContent={<FaLink />}
                            value={darkLogoUrl}
                            onChange={(e) => setDarkLogoUrl(e.target.value)}
                        />
                        {(darkLogoUrl || (existingDarkLogo && !deletedDarkLogo)) && (
                            <ImagePreview
                                alt='Dark Logo'
                                mode='dark'
                                src={darkLogoUrl || existingDarkLogo}
                                onRemove={() => {
                                    setDarkLogoUrl('')
                                    if (existingDarkLogo) {
                                        setDeletedDarkLogo(true)
                                    }
                                    setExistingDarkLogo('')
                                }}
                            />
                        )}
                    </ModalBody>

                    <ModalFooter className='flex-row-reverse border-t bg-gray-50 dark:bg-zinc-900'>
                        <Button
                            aria-label={Submit}
                            className='w-full'
                            color='primary'
                            isLoading={isLoading}
                            radius='full'
                            type='submit'
                        >
                            {Submit}
                        </Button>
                        <Button
                            aria-label='Cancel'
                            className='w-full border'
                            radius='full'
                            variant='light'
                            onPress={onClose}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Form>
        </Modal>
    )
}
