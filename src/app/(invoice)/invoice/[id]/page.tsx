'use client'

import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button, Input, Navbar, Skeleton } from '@heroui/react'
import { Edit, Minus, Plus, Search, X } from 'lucide-react'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '®ui/table'
import { Delete } from '®ui/icons'
import { useSupabse } from '®hooks/tanstack/query'
import { useInvoiceProduct } from '®hooks/tanstack/mutation'
import { usePasswordGate } from '®app/(invoice)/hooks/usePasswordGate'
import ProductModal from '®app/(invoice)/ui/product'
import LoginModal from '®app/(invoice)/ui/login'
import { InvoiceProduct } from '®types/invoice'
import { getCategoryIcon } from '®app/(invoice)/hooks/getCategory'
import SortDropdown from '®app/(invoice)/ui/sort'
import StockDropdown, { StockFilter } from '®app/(invoice)/ui/stock'

export type StockStatus = 'available' | 'low' | 'out-of-stock'

function getStockStatus(qty: number, threshold = 1): StockStatus {
    if (qty <= 0) return 'out-of-stock'
    if (qty <= threshold) return 'low'

    return 'available'
}

export default function InvoiceDetailsPage() {
    const { id } = useParams<{ id: string }>()

    const {
        data: products,
        isLoading,
        refetch,
    } = useSupabse<InvoiceProduct>('invoice_product', ['invoice_id', 'eq', id])

    const { isLoggedIn, role, login, logout } = usePasswordGate({
        storageKey: 'product-password',
        adminPassword: process.env.NEXT_PUBLIC_PRODUCT_PASSWORD!,
        userPassword: process.env.NEXT_PUBLIC_PRODUCT_USER_PASSWORD!,
    })

    const isAdmin = role === 'admin'
    const isUser = role === 'user'
    const visibleColumns = isAdmin ? 9 : isUser ? 6 : 4

    const [loginOpen, setLoginOpen] = useState(false)
    const [productModalOpen, setProductModalOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [editableProduct, setEditableProduct] = useState<InvoiceProduct | null>(null)
    const [deleteProduct, setDeleteProduct] = useState<InvoiceProduct | null>(null)

    const { updateProduct } = useInvoiceProduct(id)
    const categories = useMemo(() => {
        const all = products?.map((p) => p.category || 'Uncategorized') || []

        return Array.from(new Set(all)).sort()
    }, [products])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [stockFilter, setStockFilter] = useState<StockFilter>('all')

    const filteredProducts = useMemo(() => {
        const term = search.toLowerCase()

        return (
            products?.filter((item) => {
                const matchesSearch =
                    item.name.toLowerCase().includes(term) ||
                    item.compatibility?.toLowerCase().includes(term)

                const matchesCategory =
                    selectedCategory === 'all' || item.category === selectedCategory

                const status = getStockStatus(item.qty)
                const matchesStock = stockFilter === 'all' || status === stockFilter

                return matchesSearch && matchesCategory && matchesStock
            }) || []
        )
    }, [search, selectedCategory, stockFilter, products])

    const totalCost = useMemo(
        () => filteredProducts.reduce((sum, item) => sum + item.purchase_price * item.qty, 0),
        [filteredProducts]
    )

    const totalProduct = useMemo(
        () => filteredProducts.reduce((sum, item) => sum + item.qty, 0),
        [filteredProducts]
    )

    const handleAdd = () => {
        setEditableProduct(null)
        setProductModalOpen(true)
    }

    const handleEdit = (item: InvoiceProduct) => {
        setEditableProduct(item)
        setProductModalOpen(true)
    }

    const handleDelete = (item: InvoiceProduct) => {
        setDeleteProduct(item)
        setProductModalOpen(true)
    }

    return (
        <div className='flex flex-col space-y-2'>
            {/* Navbar */}
            <Navbar
                shouldHideOnScroll
                classNames={{ wrapper: 'h-auto w-full gap-1 p-0 py-2' }}
                maxWidth='full'
            >
                <div className='hidden h-10 w-full select-none items-center gap-1.5 sm:flex'>
                    <h1 className='text-base font-bold sm:text-lg'>Products</h1>
                </div>

                <div className='flex w-full items-center justify-end gap-2'>
                    <Input
                        className='bg-transparent'
                        classNames={{
                            inputWrapper:
                                'h-10 min-h-10 w-full rounded-sm border bg-transparent shadow-none data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
                            base: 'sm:w-[90%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]',
                        }}
                        endContent={
                            <div className='flex items-center gap-0.5'>
                                {search && (
                                    <Button
                                        isIconOnly
                                        radius='full'
                                        size='sm'
                                        startContent={<X className='h-4 w-4' />}
                                        variant='light'
                                        onPress={() => setSearch('')}
                                    />
                                )}
                                <SortDropdown
                                    categories={categories}
                                    selected={selectedCategory}
                                    onChange={setSelectedCategory}
                                />
                                <span className='text-xs text-muted-foreground'>|</span>
                                <StockDropdown selected={stockFilter} onChange={setStockFilter} />
                            </div>
                        }
                        placeholder='Search by model name'
                        startContent={<Search className='h-4 w-4 shrink-0' />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {isAdmin && (
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
                        onPress={() => (isLoggedIn ? logout() : setLoginOpen(true))}
                    />
                </div>
            </Navbar>

            {/* Product Table */}
            <div className='rounded-lg border'>
                <Table
                    aria-label='Invoice Products Table'
                    className='overflow-clip rounded-md border'
                >
                    <TableHeader>
                        <TableRow className='select-none border bg-muted/50 [&>:not(:last-child)]:border-r'>
                            <TableHead />
                            <TableHead className='text-center'>Modal</TableHead>
                            <TableHead className='text-center'>Compatibility</TableHead>
                            {(isLoggedIn || isUser) && (
                                <>
                                    <TableHead className='text-center'>Purchase</TableHead>
                                    <TableHead className='text-center'>Price</TableHead>
                                </>
                            )}
                            {isAdmin && <TableHead className='text-center'>Qty</TableHead>}
                            <TableHead className='text-center'>Status</TableHead>
                            {isAdmin && (
                                <>
                                    <TableHead className='text-center'>Total</TableHead>
                                    <TableHead className='text-center'>Actions</TableHead>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(visibleColumns)].map((_, j) => (
                                        <TableCell
                                            key={j}
                                            className='*:border-border [&>:not(:last-child)]:border-r'
                                        >
                                            <Skeleton className='mx-auto h-5 w-20 rounded-sm' />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : filteredProducts.length ? (
                            filteredProducts.map((item) => {
                                const status = getStockStatus(item.qty)

                                return (
                                    <TableRow
                                        key={item.id}
                                        className='*:border-border [&>:not(:last-child)]:border-r'
                                    >
                                        <TableCell className='text-center'>
                                            {getCategoryIcon(item.category)}
                                        </TableCell>
                                        <TableCell className='text-nowrap text-center'>
                                            {item.name}
                                        </TableCell>
                                        <TableCell className='max-w-xs text-center'>
                                            {item.compatibility}
                                        </TableCell>
                                        {(isLoggedIn || isUser) && (
                                            <>
                                                <TableCell className='text-center'>
                                                    {item.purchase_price}
                                                </TableCell>
                                                <TableCell className='text-center'>
                                                    {item.price}
                                                </TableCell>
                                            </>
                                        )}

                                        {isAdmin && (
                                            <TableCell>
                                                <div className='flex items-center justify-center gap-2'>
                                                    <Button
                                                        isIconOnly
                                                        className='border'
                                                        disabled={
                                                            updateProduct.isPending || item.qty <= 0
                                                        }
                                                        radius='full'
                                                        size='sm'
                                                        startContent={<Minus size={15} />}
                                                        variant='light'
                                                        onPress={() =>
                                                            updateProduct.mutate(
                                                                { id: item.id, qty: item.qty - 1 },
                                                                { onSuccess: refetch }
                                                            )
                                                        }
                                                    />
                                                    <span className='w-6 text-center'>
                                                        {item.qty}
                                                    </span>
                                                    <Button
                                                        isIconOnly
                                                        className='border'
                                                        disabled={updateProduct.isPending}
                                                        radius='full'
                                                        size='sm'
                                                        startContent={<Plus size={15} />}
                                                        variant='light'
                                                        onPress={() =>
                                                            updateProduct.mutate(
                                                                { id: item.id, qty: item.qty + 1 },
                                                                { onSuccess: refetch }
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                        )}

                                        <TableCell className='text-center text-lg'>
                                            {status === 'available'
                                                ? '✅'
                                                : status === 'low'
                                                  ? '🟡'
                                                  : '❌'}
                                        </TableCell>

                                        {isAdmin && (
                                            <>
                                                <TableCell className='text-center'>
                                                    {item.purchase_price * item.qty}
                                                </TableCell>
                                                <TableCell className='flex items-center justify-center gap-4'>
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
                                            </>
                                        )}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={visibleColumns}>
                                    <p className='text-center text-sm text-muted-foreground'>
                                        No products found.
                                    </p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    {isAdmin && (
                        <TableFooter>
                            <TableRow>
                                <TableCell className='text-nowrap'>
                                    Total: {filteredProducts.length}
                                </TableCell>
                                <TableCell colSpan={4} />
                                <TableCell className='text-center'>{totalProduct}</TableCell>
                                <TableCell />
                                <TableCell className='text-center'>₹{totalCost}</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>

            <ProductModal
                initialData={editableProduct || deleteProduct}
                invoiceId={id}
                isDeleting={!!deleteProduct}
                isOpen={productModalOpen}
                onClose={() => {
                    setProductModalOpen(false)
                    setEditableProduct(null)
                    setDeleteProduct(null)
                }}
                onProductUpdated={() => {
                    refetch()
                    setDeleteProduct(null)
                }}
            />

            <LoginModal
                isOpen={loginOpen}
                label='Enter Password'
                onClose={() => setLoginOpen(false)}
                onSubmit={(val) => login(val)}
            />
        </div>
    )
}
