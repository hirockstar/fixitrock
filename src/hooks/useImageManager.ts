import { useState, useRef, useEffect } from 'react'
import { addToast } from '@heroui/react'

import { Product } from '®types/products'

interface UseImageManagerProps {
    mode: 'add' | 'edit'
    product?: Product | null
    isOpen?: boolean
}

interface UseImageManagerReturn {
    images: File[]
    existingImages: string[]
    fileInputRef: React.RefObject<HTMLInputElement | null>
    handleFileSelect: (files: FileList | null) => void
    handleRemoveImage: (idx: number) => void
    handleRemoveExistingImage: (idx: number) => void
    prepareFormData: (formData: FormData) => FormData
    resetImages: () => void
}

export function useImageManager({
    mode,
    product,
    isOpen,
}: UseImageManagerProps): UseImageManagerReturn {
    const [images, setImages] = useState<File[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Reset images when modal opens/closes or product changes
    useEffect(() => {
        if (!isOpen) {
            // Reset when modal closes
            setImages([])
            setExistingImages([])
        } else if (mode === 'edit' && product?.img && Array.isArray(product.img)) {
            // Set existing images when editing and modal opens
            setExistingImages(product.img.filter((url) => typeof url === 'string'))
            setImages([]) // Clear any previous new images
        } else if (mode === 'add') {
            // Clear everything when adding new product
            setImages([])
            setExistingImages([])
        }
    }, [isOpen, mode, product?.id]) // Only depend on isOpen, mode, and product ID

    // Handle file selection
    const handleFileSelect = (files: FileList | null) => {
        if (!files) return
        const fileArr = Array.from(files)

        // Limit to 4 images total (existing + new)
        if (existingImages.length + images.length + fileArr.length > 4) {
            addToast({
                title: 'You can upload up to 4 images only.',
                color: 'warning',
            })

            return
        }
        setImages([...images, ...fileArr])
    }

    // Remove new image
    const handleRemoveImage = (idx: number) => {
        setImages(images.filter((_, i) => i !== idx))
    }

    // Remove existing image
    const handleRemoveExistingImage = (idx: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== idx))
    }

    // Reset all images
    const resetImages = () => {
        setImages([])
        setExistingImages([])
    }

    // Prepare form data with images
    const prepareFormData = (formData: FormData) => {
        // Add existing images that weren't removed
        existingImages.forEach((img) => {
            formData.append('existingImg[]', img)
        })
        // Add new images
        images.forEach((img) => {
            formData.append('img', img)
        })

        return formData
    }

    return {
        images,
        existingImages,
        fileInputRef,
        handleFileSelect,
        handleRemoveImage,
        handleRemoveExistingImage,
        prepareFormData,
        resetImages,
    }
}
