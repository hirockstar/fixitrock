'use client'

import { Button, Input, Navbar } from '@heroui/react'
import { Plus, Search } from 'lucide-react'

interface NavBarProps {
    canManage: boolean
}

export default function NavBar({ canManage }: NavBarProps) {
    const handleAddProduct = () => {}

    return (
        <Navbar
            shouldHideOnScroll
            classNames={{ wrapper: 'h-auto w-full gap-1 p-0 py-2' }}
            maxWidth='full'
        >
            <div className='hidden h-10 w-full items-center gap-1.5 select-none sm:flex'>
                <h1 className='text-base font-bold sm:text-lg'>Products</h1>
            </div>
            <div className='flex w-full items-center justify-end gap-2'>
                <Input
                    className='bg-transparent'
                    classNames={{
                        inputWrapper:
                            'h-10 min-h-10 w-full rounded-sm border bg-transparent shadow-none group-data-[focus=true]:bg-transparent data-[hover=true]:bg-transparent',
                        base: 'sm:w-[90%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]',
                    }}
                    // endContent={
                    //     <div className='flex items-center gap-0.5'>
                    //         {search && (
                    //             <Button
                    //                 isIconOnly
                    //                 radius='full'
                    //                 size='sm'
                    //                 startContent={<X className='h-4 w-4' />}
                    //                 variant='light'
                    //                 onPress={() => setSearch('')}
                    //             />
                    //         )}
                    //         <SortDropdown
                    //             categories={categories}
                    //             selected={selectedCategory}
                    //             onChange={setSelectedCategory}
                    //         />
                    //         <span className='text-muted-foreground text-xs'>|</span>
                    //         <StockDropdown selected={stockFilter} onChange={setStockFilter} />
                    //     </div>
                    // }
                    placeholder='Search by model name'
                    startContent={<Search className='h-4 w-4 shrink-0' />}
                    // value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                />

                {/* Only show Add Product button if user can manage products on this profile */}
                {canManage && (
                    <Button
                        isIconOnly
                        className='h-10 w-10 min-w-10 border'
                        radius='full'
                        size='sm'
                        startContent={<Plus size={24} />}
                        variant='light'
                        onPress={handleAddProduct}
                    />
                )}
            </div>
        </Navbar>
    )
}
