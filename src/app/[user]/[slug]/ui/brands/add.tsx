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
import { X, CirclePlus, Settings2, Eye } from 'lucide-react'
import { FaAward } from 'react-icons/fa6'
import { FaLink } from 'react-icons/fa'

import { addBrand, editBrand } from '@/actions/brands'
import { Brand } from '@/types/brands'
import { bucketUrl } from '@/supabase/bucket'

interface AddEditProps {
    isOpen: boolean
    onClose: () => void
    mode: 'add' | 'edit'
    brand?: Brand | null
}

const ImagePreview = ({
    src,
    alt,
    onRemove,
}: {
    src: string
    alt: string
    onRemove: () => void
}) => {
    return (
        <div className='mt-2 space-y-4 select-none'>
            <h3 className='flex items-center gap-2 leading-none font-semibold'>
                <Eye className='h-5 w-5' />
                Live Preview
            </h3>
            <div className='group bg-default/10 relative flex items-center justify-center gap-8 rounded-2xl border-2 border-dashed p-4 md:gap-10 md:p-8'>
                <div className='flex flex-col items-center gap-1.5'>
                    <Image
                        alt={alt}
                        className='mx-auto items-center rounded-md border bg-white object-contain p-4'
                        height={100}
                        src={src || '/fallback.png'}
                        width={100}
                    />
                    <p className='text-muted-foreground'>Light Mode</p>
                </div>
                <div className='flex flex-col items-center gap-1.5'>
                    <Image
                        alt={alt}
                        className='mx-auto items-center rounded-md border bg-black object-contain p-4'
                        height={100}
                        src={src || '/fallback.png'}
                        width={100}
                    />
                    <p className='text-muted-foreground'>Dark Mode</p>
                </div>
                <Button
                    isIconOnly
                    aria-label='Remove image'
                    className='absolute top-1.5 right-1.5 z-30 h-5 w-5 min-w-0 rounded-full p-0 opacity-0 group-hover:opacity-100'
                    onPress={onRemove}
                >
                    <X className='size-4' />
                </Button>
            </div>
        </div>
    )
}

export default function AddEdit({ isOpen, onClose, mode, brand }: AddEditProps) {
    const action = mode === 'add' ? addBrand : editBrand
    const [state, formAction, isLoading] = useActionState(action, { errors: {} })

    const [imgUrl, setImgUrl] = useState('')
    const [existingImg, setExistingImg] = useState('')
    const [deletedImg, setDeletedImg] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            setImgUrl('')
            setExistingImg('')
            setDeletedImg(false)
        } else if (mode === 'edit' && brand) {
            setExistingImg(brand.img || '')
            setImgUrl('')
            setDeletedImg(false)
        } else if (mode === 'add') {
            setImgUrl('')
            setExistingImg('')
            setDeletedImg(false)
        }
    }, [isOpen, mode, brand])

    useEffect(() => {
        if (state?.errors && Object.keys(state.errors).length > 0) {
            const errorMessage = state.errors.general || 'Please check the form fields'

            addToast({ title: errorMessage, color: 'danger' })
        } else if (!isLoading && state?.success) {
            addToast({
                title:
                    state.message ||
                    (mode === 'add' ? 'Brand added successfully!' : 'Brand updated successfully!'),
                color: 'success',
            })
            onClose()
        }
    }, [state, isLoading, onClose, mode])

    const handleFormSubmit = async (formData: FormData) => {
        if (!deletedImg) {
            if (imgUrl) formData.append('img', imgUrl)
            else if (existingImg) formData.append('img', existingImg)
        }
        if (deletedImg) {
            formData.append('delete_img', 'true')
        }
        await formAction(formData)
    }

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
                        <Input
                            defaultValue={mode === 'edit' ? brand?.keywords || '' : ''}
                            errorMessage={state?.errors?.keywords}
                            isInvalid={!!state?.errors?.keywords}
                            label='Keywords'
                            labelPlacement='outside'
                            name='keywords'
                            placeholder='iPhone, MacBook, iPad, etc.'
                            radius='sm'
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
                            errorMessage={state?.errors?.img}
                            id='img'
                            isInvalid={!!state?.errors?.img}
                            label='Brand Image URL'
                            labelPlacement='outside'
                            placeholder='https://example.com/logo.svg'
                            radius='sm'
                            startContent={<FaLink />}
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                        />
                        {(imgUrl || (existingImg && !deletedImg)) && (
                            <ImagePreview
                                alt='Brand Image'
                                src={imgUrl || bucketUrl(existingImg)}
                                onRemove={() => {
                                    setImgUrl('')
                                    if (existingImg) setDeletedImg(true)
                                    setExistingImg('')
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
