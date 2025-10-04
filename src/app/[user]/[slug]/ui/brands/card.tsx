'use client'

import { Button, Card, CardBody, CardHeader, Image, Navbar, useDisclosure } from '@heroui/react'
import { Building2, Edit, Plus } from 'lucide-react'
import { useState } from 'react'
import { FaAward } from 'react-icons/fa6'
import { useHotkeys } from 'react-hotkeys-hook'

import { Delete } from '@/ui/icons'
import { Brand } from '@/types/brands'
import { Input } from '@/app/(space)/ui'
import { bucketUrl } from '@/supabase/bucket'
import { fallback } from '@/config/site'

import AddEdit from './add'
import DeleteBrand from './delete'

// Subcomponent for a single brand card
function BrandItemCard({
    brand,
    onEdit,
    onDelete,
}: {
    brand: Brand
    onEdit: (b: Brand) => void
    onDelete: (b: Brand) => void
}) {
    return (
        <Card
            key={brand.id}
            isHoverable
            className='dark:data-[hover=true]:bg-muted/50 border bg-transparent shadow-none'
        >
            <CardHeader className='justify-between'>
                <div className='flex gap-3'>
                    <>
                        <Image
                            removeWrapper
                            alt={brand.name}
                            className='bg-background rounded-lg border object-contain p-0.5'
                            height={60}
                            radius='sm'
                            src={bucketUrl(brand.img) || fallback.brand}
                            width={60}
                        />
                    </>
                    <div className='flex flex-col'>
                        <p className='text-lg'>{brand.name}</p>
                        <p className='text-muted-foreground text-sm'>Brand</p>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <Button
                        isIconOnly
                        className='bg-background border'
                        radius='full'
                        size='sm'
                        startContent={<Edit size={18} />}
                        variant='light'
                        onPress={() => onEdit(brand)}
                    />
                    <Button
                        isIconOnly
                        className='bg-background border'
                        color='danger'
                        radius='full'
                        size='sm'
                        startContent={<Delete />}
                        variant='light'
                        onPress={() => onDelete(brand)}
                    />
                </div>
            </CardHeader>
            <CardBody className='pt-0'>
                <p className='text-muted-foreground line-clamp-3 flex-1 text-sm'>
                    {brand.description}
                </p>
            </CardBody>
        </Card>
    )
}

export function BrandCard({ brands }: { brands: Brand[] }) {
    const [search, setSearch] = useState('')
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

    // Modal open/close state using useDisclosure
    const addModal = useDisclosure({ defaultOpen: false })
    const editModal = useDisclosure({ defaultOpen: false })
    const deleteModal = useDisclosure({ defaultOpen: false })

    // Filter brands by name only
    const filteredBrands = brands.filter((brand: Brand) =>
        brand.name.toLowerCase().includes(search.toLowerCase())
    )

    useHotkeys('ctrl+a, meta+a', (event) => {
        event.preventDefault()
        addModal.onOpen()
    })

    return (
        <>
            <Navbar
                shouldHideOnScroll
                classNames={{
                    wrapper: 'h-auto p-0 py-2',
                }}
                maxWidth='full'
            >
                <div className='hidden items-center gap-4 md:flex'>
                    <FaAward className='h-8 w-8' />
                    <h1 className='text-xl font-bold'>Brand Manager</h1>
                </div>
                <div className='flex w-full items-center gap-4 md:w-auto'>
                    <Input
                        base='w-full'
                        end={
                            <Button
                                isIconOnly
                                className='border-1.5 bg-default/20 dark:bg-default/40 h-8 w-8 border-dashed p-0 md:hidden'
                                radius='full'
                                size='sm'
                                startContent={<Plus size={20} />}
                                variant='light'
                                onPress={addModal.onOpen}
                            />
                        }
                        hotKey='F'
                        placeholder='Search brand . . . '
                        value={search}
                        onInput={(e) => setSearch(e.currentTarget.value)}
                    />
                    <Button
                        className='bg-default/20 dark:bg-default/40 hidden h-10 min-h-10 min-w-fit rounded-sm border border-dashed md:flex'
                        variant='light'
                        onPress={addModal.onOpen}
                    >
                        <Plus size={18} /> Add Brand
                    </Button>
                </div>
            </Navbar>
            {filteredBrands.length > 0 ? (
                <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4'>
                    {filteredBrands.map((brand: Brand) => (
                        <BrandItemCard
                            key={brand.id}
                            brand={brand}
                            onDelete={(b: Brand) => {
                                setSelectedBrand(b)
                                deleteModal.onOpen()
                            }}
                            onEdit={(b: Brand) => {
                                setSelectedBrand(b)
                                editModal.onOpen()
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className='py-12 text-center'>
                    <Building2 className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                    <h3 className='mb-2 text-lg font-medium text-gray-900'>No brands found</h3>
                    <p className='text-muted-foreground mb-6'>
                        {search
                            ? 'Try adjusting your search terms.'
                            : 'Get started by adding your first brand.'}
                    </p>
                    {!search && (
                        <Button
                            className='mx-auto flex items-center gap-2'
                            onPress={addModal.onOpen}
                        >
                            <Plus className='h-4 w-4' /> Add Your First Brand
                        </Button>
                    )}
                </div>
            )}
            {/* Add Modal */}
            <AddEdit isOpen={addModal.isOpen} mode='add' onClose={addModal.onClose} />
            {/* Edit Modal */}
            <AddEdit
                brand={selectedBrand!}
                isOpen={editModal.isOpen}
                mode='edit'
                onClose={editModal.onClose}
            />
            {/* Delete Modal */}
            <DeleteBrand
                brand={selectedBrand!}
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
            />
        </>
    )
}
