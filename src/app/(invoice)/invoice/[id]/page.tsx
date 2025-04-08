'use client'

import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button, Input, Navbar, Skeleton } from '@heroui/react'
import { Edit, Plus, Search, X } from 'lucide-react'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import React from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '®ui/table'
import { useSupabse } from '®hooks/tanstack/query'
import { InvoiceProduct } from '®types/invoice'
import ProductModal from '®app/(invoice)/ui/product'
import LoginModal from '®app/(invoice)/ui/login'
import { Delete } from '®ui/icons'
import { usePasswordGate } from '®app/(invoice)/hooks/usePasswordGate'

export default function InvoiceDetailsPage() {
    const { id } = useParams<{ id: string }>()

    const {
        data: products,
        isLoading,
        refetch,
    } = useSupabse<InvoiceProduct>('invoice_product', ['invoice_id', 'eq', id])
    const { isLoggedIn, login, logout } = usePasswordGate(
        'product-password',
        process.env.NEXT_PUBLIC_PRODUCT_PASSWORD as string
    )
    const [loginOpen, setLoginOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const [search, setSearch] = useState('')
    const [selectedItem, setSelectedItem] = useState<InvoiceProduct | null>(null)

    const { totalCost } = useMemo(() => {
        const totalCost =
            products?.reduce((acc, item) => acc + item.purchase_price * item.qty, 0) || 0

        return { totalCost }
    }, [products])
    const filteredProducts = useMemo(() => {
        return (
            products?.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())) || []
        )
    }, [products, search])
    const handleAdd = () => {
        setSelectedItem(null)
        setOpenModal(true)
    }

    const handleEdit = (item: InvoiceProduct) => {
        setSelectedItem(item)
        setOpenModal(true)
    }

    const handleDelete = (item: InvoiceProduct) => {
        setDeleteItem(item)
        setOpenModal(true)
    }
    const [deleteItem, setDeleteItem] = useState<InvoiceProduct | null>(null)

    return (
        <div className='flex flex-col space-y-2'>
            <Navbar
                shouldHideOnScroll
                classNames={{
                    wrapper: 'h-auto w-full gap-1 p-0 py-2',
                }}
                maxWidth='full'
            >
                <div className='hidden h-10 w-full select-none items-center gap-1.5 sm:flex'>
                    <h1 className='text-base font-bold sm:text-lg'>Products</h1>
                </div>
                <div className='flex w-full select-none items-center justify-end gap-2'>
                    <Input
                        className='bg-transparent'
                        classNames={{
                            inputWrapper:
                                'h-10 min-h-10 w-full rounded-full border bg-transparent shadow-none data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
                            base: 'sm:w-[90%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]',
                        }}
                        endContent={
                            search ? (
                                <Button
                                    isIconOnly
                                    radius='full'
                                    size='sm'
                                    startContent={<X className='h-4 w-4 shrink-0' />}
                                    variant='light'
                                    onPress={() => setSearch('')}
                                />
                            ) : undefined
                        }
                        placeholder='Search by modal name'
                        startContent={<Search className='h-4 w-4 shrink-0' />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {isLoggedIn && (
                        <Button
                            isIconOnly
                            className='h-10 w-10 min-w-10 border'
                            radius='full'
                            size='sm'
                            startContent={<Plus size={24} />}
                            variant='light'
                            onPress={handleAdd}
                        />
                    )}
                    <Button
                        isIconOnly
                        className='h-10 w-10 min-w-10'
                        color={isLoggedIn ? 'danger' : 'default'}
                        radius='full'
                        size='sm'
                        startContent={
                            isLoggedIn ? <BiLogOutCircle size={24} /> : <BiLogInCircle size={24} />
                        }
                        onPress={() => {
                            if (isLoggedIn) {
                                logout()
                            } else {
                                setLoginOpen(true)
                            }
                        }}
                    />
                    <ProductModal
                        initialData={selectedItem || deleteItem}
                        invoiceId={id}
                        isDeleting={!!deleteItem}
                        isOpen={openModal}
                        onClose={() => {
                            setOpenModal(false)
                            setSelectedItem(null)
                            setDeleteItem(null)
                        }}
                        onProductUpdated={() => {
                            refetch()
                            setDeleteItem(null)
                        }}
                    />

                    <LoginModal
                        isOpen={loginOpen}
                        label='Enter Invoice Password'
                        onClose={() => setLoginOpen(false)}
                        onSubmit={(val) => login(val)}
                    />
                </div>
            </Navbar>
            <div className='rounded-lg border'>
                <Table
                    aria-label='Invoice Products Table'
                    className='overflow-hidden rounded-md border'
                >
                    <TableHeader>
                        <TableRow className='select-none bg-muted/50'>
                            <TableHead>Name</TableHead>
                            {isLoggedIn && <TableHead>Purchase</TableHead>}
                            <TableHead>Price</TableHead>
                            {isLoggedIn && <TableHead>Qty</TableHead>}
                            {isLoggedIn && <TableHead>Total</TableHead>}
                            {isLoggedIn && <TableHead>Edit</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: isLoggedIn ? 6 : 2 }).map((_, i) => (
                                        <TableCell key={i}>
                                            <Skeleton className='h-5 w-20 rounded-sm' />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : filteredProducts?.length ? (
                            filteredProducts.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className='text-nowrap'>{item.name}</TableCell>
                                    {isLoggedIn && <TableCell>{item.purchase_price}</TableCell>}
                                    <TableCell>{item.price}</TableCell>
                                    {isLoggedIn && <TableCell>{item.qty}</TableCell>}
                                    {isLoggedIn && (
                                        <TableCell>{item.purchase_price * item.qty}</TableCell>
                                    )}
                                    {isLoggedIn && (
                                        <TableCell className='flex items-center gap-4'>
                                            <Button
                                                isIconOnly
                                                className='border'
                                                radius='full'
                                                size='sm'
                                                startContent={<Edit size={18} />}
                                                variant='light'
                                                onPress={() => handleEdit(item)}
                                            />
                                            <Button
                                                isIconOnly
                                                className='border'
                                                color='danger'
                                                radius='full'
                                                size='sm'
                                                startContent={<Delete />}
                                                variant='light'
                                                onPress={() => handleDelete(item)}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={isLoggedIn ? 6 : 2}>
                                    <p className='text-center text-sm text-muted-foreground'>
                                        No products found.
                                    </p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    {isLoggedIn && (
                        <TableFooter>
                            <TableRow>
                                <TableCell>Total: {products?.length}</TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell>₹{totalCost}</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>
        </div>
    )
}
