'use client'

import { Button, Input, Navbar, useDisclosure } from '@heroui/react'
import { Plus, Search } from 'lucide-react'

import AddEdit from './add'

interface NavBarProps {
    canManage: boolean
}

export default function NavBar({ canManage }: NavBarProps) {
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultOpen: false })

    return (
        <>
            <Navbar
                shouldHideOnScroll
                classNames={{ wrapper: 'h-auto w-full gap-1 p-0 py-2' }}
                maxWidth='full'
            >
                <div className='hidden h-10 w-full items-center gap-1.5 select-none sm:flex'>
                    <h1 className='text-base font-bold sm:text-lg'>Products</h1>
                </div>
                <div className='flex w-full items-center justify-end gap-3'>
                    <Input
                        className='bg-transparent'
                        classNames={{
                            inputWrapper:
                                'h-10 min-h-10 w-full rounded-sm border bg-transparent shadow-none group-data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent',
                            base: 'sm:w-[90%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]',
                        }}
                        placeholder='Search by model name'
                        startContent={<Search className='h-4 w-4 shrink-0' />}
                    />

                    {/* Only show Add Product button if user can manage products on his profile */}
                    {canManage && (
                        <>
                            <Button
                                isIconOnly
                                className='h-10 min-h-10 rounded-lg border md:hidden'
                                startContent={<Plus size={20} />}
                                variant='light'
                                onPress={onOpen}
                            />
                            <Button
                                className='hidden h-10 shrink-0 rounded-md border shadow-none md:flex'
                                color='primary'
                                startContent={<Plus size={20} />}
                                onPress={onOpen}
                            >
                                Add Product
                            </Button>
                        </>
                    )}
                </div>
            </Navbar>

            {/* Add Product Modal */}
            <AddEdit isOpen={isOpen} mode='add' onClose={onClose} />
        </>
    )
}
