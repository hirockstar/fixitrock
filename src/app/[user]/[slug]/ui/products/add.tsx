'use client'

import { useEffect, useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Input,
    Button,
    Textarea,
    Select,
    SelectItem,
    Chip,
} from '@heroui/react'
import { Plus, X } from 'lucide-react'

import { addProduct } from '®actions/products'

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

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

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        description: '',
        purchase: '',
        staff_price: '',
        price: '',
        qty: '',
        category: '',
        brand: '',
        img: [] as string[],
        other: {},
    })

    const [newImageUrl, setNewImageUrl] = useState('')

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setForm({
                name: '',
                description: '',
                purchase: '',
                staff_price: '',
                price: '',
                qty: '',
                category: '',
                brand: '',
                img: [],
                other: {},
            })
            setNewImageUrl('')
        }
    }, [isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const addImage = () => {
        if (newImageUrl.trim() && !form.img.includes(newImageUrl.trim())) {
            setForm((prev) => ({ ...prev, img: [...prev.img, newImageUrl.trim()] }))
            setNewImageUrl('')
        }
    }

    const removeImage = (index: number) => {
        setForm((prev) => ({ ...prev, img: prev.img.filter((_, i) => i !== index) }))
    }

    const handleSubmit = async () => {
        // Basic validation
        if (!form.name.trim()) {
            alert('Product name is required')

            return
        }
        if (!form.purchase || parseFloat(form.purchase) <= 0) {
            alert('Purchase price must be greater than 0')

            return
        }
        if (!form.qty || parseInt(form.qty) < 0) {
            alert('Quantity must be 0 or greater')

            return
        }

        setIsLoading(true)
        try {
            const result = await addProduct({
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                purchase: parseFloat(form.purchase),
                staff_price: form.staff_price ? parseFloat(form.staff_price) : undefined,
                price: form.price ? parseFloat(form.price) : undefined,
                qty: parseInt(form.qty),
                category: form.category || undefined,
                brand: form.brand || undefined,
                img: form.img.length > 0 ? form.img : undefined,
                other: form.other,
            })

            if (result.success) {
                onClose()
                onSuccess?.()
                // Reset form
                setForm({
                    name: '',
                    description: '',
                    purchase: '',
                    staff_price: '',
                    price: '',
                    qty: '',
                    category: '',
                    brand: '',
                    img: [],
                    other: {},
                })
            } else {
                alert(result.error || 'Failed to add product')
            }
        } catch {
            alert('An error occurred while adding the product')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} size='2xl' onClose={onClose}>
            <ModalContent>
                <ModalHeader>Add New Product</ModalHeader>
                <ModalBody className='flex max-h-[70vh] flex-col gap-4 overflow-y-auto'>
                    {/* Basic Information */}
                    <div className='space-y-3'>
                        <h3 className='text-sm font-semibold text-gray-600'>Basic Information</h3>
                        <Input
                            isRequired
                            label='Product Name *'
                            name='name'
                            placeholder='e.g., iPhone 15 Battery'
                            value={form.name}
                            onChange={handleChange}
                        />
                        <Textarea
                            label='Description'
                            minRows={2}
                            name='description'
                            placeholder='Product description...'
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Pricing */}
                    <div className='space-y-3'>
                        <h3 className='text-sm font-semibold text-gray-600'>Pricing</h3>
                        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                            <Input
                                isRequired
                                label='Purchase Price *'
                                name='purchase'
                                placeholder='0.00'
                                startContent={<span className='text-gray-500'>₹</span>}
                                type='number'
                                value={form.purchase}
                                onChange={handleChange}
                            />
                            <Input
                                label='Staff Price'
                                name='staff_price'
                                placeholder='0.00'
                                startContent={<span className='text-gray-500'>₹</span>}
                                type='number'
                                value={form.staff_price}
                                onChange={handleChange}
                            />
                            <Input
                                label='Customer Price'
                                name='price'
                                placeholder='0.00'
                                startContent={<span className='text-gray-500'>₹</span>}
                                type='number'
                                value={form.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className='space-y-3'>
                        <h3 className='text-sm font-semibold text-gray-600'>Inventory</h3>
                        <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                            <Input
                                isRequired
                                label='Quantity *'
                                min='0'
                                name='qty'
                                placeholder='0'
                                type='number'
                                value={form.qty}
                                onChange={handleChange}
                            />
                            <Select
                                label='Category'
                                placeholder='Select category'
                                selectedKeys={form.category ? [form.category] : []}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0] as string

                                    handleSelectChange('category', selected)
                                }}
                            >
                                {CATEGORIES.map((category) => (
                                    <SelectItem key={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                label='Brand'
                                placeholder='Select brand'
                                selectedKeys={form.brand ? [form.brand] : []}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0] as string

                                    handleSelectChange('brand', selected)
                                }}
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
                                placeholder='Image URL'
                                value={newImageUrl}
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

                        {form.img.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {form.img.map((url, index) => (
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
                </ModalBody>
                <ModalFooter>
                    <Button isDisabled={isLoading} variant='light' onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color='primary'
                        isDisabled={!form.name.trim() || !form.purchase || !form.qty}
                        isLoading={isLoading}
                        onPress={handleSubmit}
                    >
                        Add Product
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
