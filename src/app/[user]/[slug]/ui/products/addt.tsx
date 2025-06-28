// 'use client'

// import React, { useState, useEffect } from 'react'
// import {
//     Modal,
//     ModalBody,
//     ModalContent,
//     ModalHeader,
//     ModalFooter,
//     Input,
//     Textarea,
//     Button,
//     Autocomplete,
//     AutocompleteItem,
//     Form,
//     addToast,
// } from '@heroui/react'
// import { Box, Tag, IndianRupee, X } from 'lucide-react'

// import { addProduct } from '®actions/products'

// const CATEGORIES = [
//     'battery',
//     'display',
//     'camera',
//     'speaker',
//     'charger',
//     'cable',
//     'case',
//     'screen protector',
//     'other',
// ]
// const BRANDS = [
//     'Apple',
//     'Samsung',
//     'Xiaomi',
//     'OnePlus',
//     'Google',
//     'Huawei',
//     'Oppo',
//     'Vivo',
//     'Realme',
//     'Other',
// ]

// interface AddProductModalProps {
//     isOpen: boolean
//     onClose: () => void
//     onSuccess?: () => void
// }

// const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
//     <div className='flex items-center gap-2 py-2 select-none'>
//         <div>{icon}</div>
//         <h3 className='text-foreground text-sm font-semibold tracking-wide uppercase'>{title}</h3>
//     </div>
// )

// export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
//     const [formValues, setFormValues] = useState({
//         name: '',
//         compatible: '',
//         purchase: '',
//         staff_price: '',
//         price: '',
//         qty: '',
//         category: '',
//         brand: '',
//     })
//     // const [newImageUrl, setNewImageUrl] = useState('')
//     const [images, setImages] = useState<string[]>([])
//     const [errors, setErrors] = useState<Record<string, string>>({})
//     const [isLoading, setIsLoading] = useState(false)

//     useEffect(() => {
//         if (!isOpen) {
//             setFormValues({
//                 name: '',
//                 compatible: '',
//                 purchase: '',
//                 staff_price: '',
//                 price: '',
//                 qty: '',
//                 category: '',
//                 brand: '',
//             })
//             // setNewImageUrl('')
//             setImages([])
//             setErrors({})
//         }
//     }, [isOpen])

//     const handleFieldChange = (field: string, value: string) => {
//         setFormValues((prev) => ({ ...prev, [field]: value }))
//     }

//     // Check if all required fields are filled
//     const isFormValid = () => {
//         return (
//             formValues.name.trim() !== '' &&
//             formValues.compatible.trim() !== '' &&
//             formValues.purchase.trim() !== '' &&
//             parseFloat(formValues.purchase) > 0 &&
//             formValues.staff_price.trim() !== '' &&
//             parseFloat(formValues.staff_price) > 0 &&
//             formValues.price.trim() !== '' &&
//             parseFloat(formValues.price) > 0 &&
//             formValues.qty.trim() !== '' &&
//             parseInt(formValues.qty) >= 0 &&
//             formValues.category !== '' &&
//             formValues.brand !== ''
//         )
//     }

//     const validateForm = (formData: FormData) => {
//         const newErrors: Record<string, string> = {}

//         if (!formData.get('name')?.toString().trim()) newErrors.name = 'Name is required'
//         if (!formData.get('compatible')?.toString().trim())
//             newErrors.compatible = 'Compatibility is required'
//         if (!formData.get('purchase') || parseFloat(formData.get('purchase') as string) <= 0)
//             newErrors.purchase = 'Must be > 0'
//         if (!formData.get('staff_price') || parseFloat(formData.get('staff_price') as string) <= 0)
//             newErrors.staff_price = 'Must be > 0'
//         if (!formData.get('price') || parseFloat(formData.get('price') as string) <= 0)
//             newErrors.price = 'Must be > 0'
//         if (!formData.get('qty') || parseInt(formData.get('qty') as string) < 0)
//             newErrors.qty = 'Must be ≥ 0'
//         if (!formData.get('category')) newErrors.category = 'Category is required'
//         if (!formData.get('brand')) newErrors.brand = 'Brand is required'

//         setErrors(newErrors)

//         return Object.keys(newErrors).length === 0
//     }

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault()
//         const formData = new FormData(event.currentTarget)

//         if (!validateForm(formData)) {
//             addToast({
//                 title: 'Validation Error',
//                 description: Object.values(errors).join(', ') || 'Please fill all required fields',
//                 color: 'danger',
//             })

//             return
//         }

//         setIsLoading(true)
//         try {
//             const result = await addProduct({
//                 name: formData.get('name') as string,
//                 compatible: formData.get('compatible') as string,
//                 description: formData.get('description') as string,
//                 purchase: parseFloat(formData.get('purchase') as string),
//                 staff_price: parseFloat(formData.get('staff_price') as string),
//                 price: parseFloat(formData.get('price') as string),
//                 qty: parseInt(formData.get('qty') as string),
//                 category: formData.get('category') as string,
//                 brand: formData.get('brand') as string,
//                 img: images.length > 0 ? images : undefined,
//                 other: {},
//             })

//             if (result.success) {
//                 addToast({ title: 'Product Added', description: 'Success!', color: 'success' })
//                 onClose()
//                 onSuccess?.()
//             } else {
//                 addToast({
//                     title: 'Failed',
//                     description: result.error || 'Try again.',
//                     color: 'danger',
//                 })
//             }
//         } catch {
//             addToast({ title: 'Error', description: 'Something went wrong', color: 'danger' })
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     // const addImage = () => {
//     //     if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
//     //         setImages([...images, newImageUrl.trim()])
//     //         setNewImageUrl('')
//     //     }
//     // }

//     // const removeImage = (index: number) => {
//     //     setImages(images.filter((_, i) => i !== index))
//     // }

//     return (
//         <Modal
//             hideCloseButton
//             className='border'
//             isOpen={isOpen}
//             placement='center'
//             scrollBehavior='inside'
//             size='2xl'
//             onClose={onClose}
//         >
//             <ModalContent>
//                 <ModalHeader className='flex-1 items-center justify-between border-b select-none'>
//                     <p>Add New Product</p>
//                     <Button
//                         isIconOnly
//                         className='border'
//                         isDisabled={isLoading}
//                         radius='full'
//                         size='sm'
//                         startContent={<X size={18} />}
//                         variant='light'
//                         onPress={onClose}
//                     />
//                 </ModalHeader>
//                 <ModalBody className=''>
//                     <Form validationErrors={errors} onSubmit={handleSubmit}>
//                         {/* Product Details */}
//                         <SectionHeader icon={<Box size={16} />} title='Product Details' />
//                         <Input
//                             isRequired
//                             errorMessage={errors.name}
//                             isInvalid={!!errors.name}
//                             label='Product Name'
//                             name='name'
//                             placeholder='e.g., iPhone 15 Battery'
//                             size='sm'
//                             value={formValues.name}
//                             onChange={(e) => handleFieldChange('name', e.target.value)}
//                         />
//                         <Input
//                             errorMessage={errors.compatible}
//                             isInvalid={!!errors.compatible}
//                             label='Compatibility'
//                             name='compatible'
//                             placeholder='e.g., iPhone 15, iPhone 15 Pro'
//                             size='sm'
//                             value={formValues.compatible}
//                             onChange={(e) => handleFieldChange('compatible', e.target.value)}
//                         />
//                         <Textarea
//                             label='Description'
//                             minRows={2}
//                             name='description'
//                             placeholder='Features, specs, etc.'
//                             size='sm'
//                         />

//                         {/* Category & Brand */}
//                         <SectionHeader icon={<Tag size={16} />} title='Category & Brand' />
//                         <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
//                             <Autocomplete
//                                 isRequired
//                                 errorMessage={errors.category}
//                                 isInvalid={!!errors.category}
//                                 label='Category'
//                                 name='category'
//                                 placeholder='Choose category'
//                                 selectedKey={formValues.category}
//                                 size='sm'
//                                 onSelectionChange={(key) =>
//                                     handleFieldChange('category', key as string)
//                                 }
//                             >
//                                 {CATEGORIES.map((c) => (
//                                     <AutocompleteItem key={c}>{c}</AutocompleteItem>
//                                 ))}
//                             </Autocomplete>
//                             <Autocomplete
//                                 isRequired
//                                 errorMessage={errors.brand}
//                                 isInvalid={!!errors.brand}
//                                 label='Brand'
//                                 name='brand'
//                                 placeholder='Choose brand'
//                                 selectedKey={formValues.brand}
//                                 size='sm'
//                                 onSelectionChange={(key) =>
//                                     handleFieldChange('brand', key as string)
//                                 }
//                             >
//                                 {BRANDS.map((b) => (
//                                     <AutocompleteItem key={b}>{b}</AutocompleteItem>
//                                 ))}
//                             </Autocomplete>
//                         </div>

//                         {/* Pricing & Stock */}
//                         <SectionHeader icon={<IndianRupee size={16} />} title='Pricing & Stock' />
//                         <div className='grid grid-cols-2 gap-4 pb-2 sm:grid-cols-4'>
//                             <Input
//                                 isRequired
//                                 errorMessage={errors.purchase}
//                                 isInvalid={!!errors.purchase}
//                                 label='Purchase Price'
//                                 min='0'
//                                 name='purchase'
//                                 placeholder='₹0'
//                                 size='sm'
//                                 type='number'
//                                 value={formValues.purchase}
//                                 onChange={(e) => handleFieldChange('purchase', e.target.value)}
//                             />
//                             <Input
//                                 isRequired
//                                 errorMessage={errors.staff_price}
//                                 isInvalid={!!errors.staff_price}
//                                 label='Staff Price'
//                                 min='0'
//                                 name='staff_price'
//                                 placeholder='₹0'
//                                 size='sm'
//                                 type='number'
//                                 value={formValues.staff_price}
//                                 onChange={(e) => handleFieldChange('staff_price', e.target.value)}
//                             />
//                             <Input
//                                 isRequired
//                                 errorMessage={errors.price}
//                                 isInvalid={!!errors.price}
//                                 label='Customer Price'
//                                 min='0'
//                                 name='price'
//                                 placeholder='₹0'
//                                 size='sm'
//                                 type='number'
//                                 value={formValues.price}
//                                 onChange={(e) => handleFieldChange('price', e.target.value)}
//                             />
//                             <Input
//                                 isRequired
//                                 errorMessage={errors.qty}
//                                 isInvalid={!!errors.qty}
//                                 label='Quantity'
//                                 min='0'
//                                 name='qty'
//                                 placeholder='0'
//                                 size='sm'
//                                 type='number'
//                                 value={formValues.qty}
//                                 onChange={(e) => handleFieldChange('qty', e.target.value)}
//                             />
//                         </div>

//                         {/* Images - Commented out for now */}
//                         {/* <SectionHeader icon={<ImagePlus size={16} />} title='Product Images' />
//                         <div className='flex w-full items-center gap-2'>
//                             <Input
//                                 className='flex-1'
//                                 placeholder='Paste image URL'
//                                 size='sm'
//                                 value={newImageUrl}
//                                 onChange={(e) => setNewImageUrl(e.target.value)}
//                                 onKeyDown={(e) => e.key === 'Enter' && addImage()}
//                             />
//                             <Button
//                                 isIconOnly
//                                 color='secondary'
//                                 isDisabled={!newImageUrl.trim()}
//                                 size='sm'
//                                 variant='flat'
//                                 onPress={addImage}
//                             >
//                                 <Plus size={16} />
//                             </Button>
//                         </div>

//                         {images.length > 0 && (
//                             <div className='mt-3 flex flex-wrap gap-3'>
//                                 {images.map((url, idx) => (
//                                     <div
//                                         key={idx}
//                                         className='group relative h-[64px] w-[64px] overflow-hidden rounded border'
//                                     >
//                                         <img
//                                             alt='Product'
//                                             className='h-full w-full object-cover'
//                                             src={url}
//                                         />
//                                         <Button
//                                             className='bg-opacity-50 absolute top-0 right-0 rounded-bl bg-black p-0.5 text-white'
//                                             type='button'
//                                             onPress={() => removeImage(idx)}
//                                         >
//                                             <X size={12} />
//                                         </Button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )} */}
//                     </Form>
//                 </ModalBody>
//                 <ModalFooter className='border-t'>
//                     <Button
//                         className='w-full border'
//                         isDisabled={isLoading}
//                         radius='full'
//                         variant='light'
//                         onPress={onClose}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         className='w-full'
//                         color='primary'
//                         isDisabled={isLoading || !isFormValid()}
//                         isLoading={isLoading}
//                         radius='full'
//                         type='submit'
//                     >
//                         Add Product
//                     </Button>
//                 </ModalFooter>
//             </ModalContent>
//         </Modal>
//     )
// }
