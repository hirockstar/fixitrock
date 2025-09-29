'use client'

import { useState, useMemo, useEffect } from 'react'
import {
    Button,
    Tooltip,
    useDisclosure,
    Navbar,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
    TableColumn,
    Pagination,
    Chip,
    ScrollShadow,
} from '@heroui/react'
import React from 'react'
import { ArrowLeft, ArrowRight, Edit, Plus } from 'lucide-react'
import { RiArrowRightUpLine } from 'react-icons/ri'

import { Product, Products } from '@/types/products'
import { Brand } from '@/types/brands'
import { formatPrice, getStockStatus } from '@/lib/utils'
import { Delete } from '@/ui/icons'
import { Input } from '@/app/(space)/ui'
import { Badge } from '@/ui/badge'
import { useProductFilterStore } from '@/zustand/filter'
import { useDragScroll } from '@/hooks'

import AddEdit from './add'
import Quantity from './quantity'
import { Filter } from './filter'
import DeleteProduct from './delete'

interface ProductsTableProps {
    products: Products
    canManage: boolean
    brand: Brand[]
}

export default function ProductsTable({ products, canManage, brand }: ProductsTableProps) {
    const [addProduct, setAddProduct] = useState<Product | null>(null)

    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const [searchTerm, setSearchTerm] = useState('')
    const { values: filterValues, getActiveFilters } = useProductFilterStore()

    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onClose: onAddClose,
    } = useDisclosure({ defaultOpen: false })
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure({ defaultOpen: false })
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure({ defaultOpen: false })

    const categories = useMemo<string[]>(() => {
        const uniqueCategories = [
            ...new Set(products.map((p) => p.category).filter((v): v is string => !!v)),
        ]

        return ['all', ...uniqueCategories]
    }, [products])

    const brands = useMemo<string[]>(() => {
        const uniqueBrands = [
            ...new Set(products.map((p) => p.brand).filter((v): v is string => !!v)),
        ]

        return ['all', ...uniqueBrands]
    }, [products])
    const statusOptions = [
        { key: 'in', label: 'In Stock' },
        { key: 'low', label: 'Low Stock' },
        { key: 'out', label: 'Sold Out' },
    ]

    const activeFilters = useMemo(() => {
        return getActiveFilters(statusOptions)
    }, [filterValues, getActiveFilters])

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                searchTerm === '' ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.compatible.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesCategory =
                filterValues.categories.length === 0 ||
                filterValues.categories.includes(product.category || '')
            const matchesBrand =
                filterValues.brands.length === 0 ||
                filterValues.brands.includes(product.brand || '')

            let matchesStatus = true

            if (filterValues.status.length > 0) {
                const statusText = getStockStatus(product.qty).text
                const selectedLabels = statusOptions
                    .filter((s) => filterValues.status.includes(s.key))
                    .map((s) => s.label)

                matchesStatus = selectedLabels.includes(statusText)
            }

            return matchesSearch && matchesCategory && matchesBrand && matchesStatus
        })
    }, [products, searchTerm, filterValues])

    const { totalPrice, totalProducts } = useMemo(() => {
        const total = filteredProducts.reduce((acc, product) => {
            return acc + product.purchase * product.qty
        }, 0)

        return {
            totalPrice: total,
            totalProducts: filteredProducts.length,
        }
    }, [filteredProducts])

    const pageSize = 10
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredProducts.length / pageSize))
    }, [filteredProducts])

    useEffect(() => {
        setCurrentPage((p) => Math.min(p, totalPages))
    }, [totalPages])

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize

        return filteredProducts.slice(startIndex, endIndex)
    }, [filteredProducts, currentPage])
    const showPagination = filteredProducts.length > pageSize
    const { outOfStockCount, lowStockCount } = useMemo(() => {
        let outOf = 0
        let low = 0

        for (const product of filteredProducts) {
            const statusText = getStockStatus(product.qty).text

            if (statusText === 'Sold Out') outOf++
            else if (statusText === 'Low Stock') low++
        }

        return { outOfStockCount: outOf, lowStockCount: low }
    }, [filteredProducts])

    const stats = useMemo(
        () => [
            {
                title: 'Total Price',
                value: formatPrice(totalPrice),
                color: 'text-emerald-500',
            },
            {
                title: 'Total Products',
                value: String(totalProducts),
                color: 'text-foreground',
            },
            {
                title: 'Sold Out',
                value: String(outOfStockCount),
                color: 'text-red-500',
            },
            {
                title: 'Low Stock',
                value: String(lowStockCount),
                color: 'text-amber-500',
            },
        ],
        [totalPrice, totalProducts, outOfStockCount, lowStockCount]
    )

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        onEditOpen()
    }

    const handleDelete = (product: Product) => {
        setDeletingProduct(product)
        onDeleteOpen()
    }

    const scrollShadowRef = useDragScroll()

    return (
        <main className='space-y-4'>
            <Navbar
                shouldHideOnScroll
                classNames={{
                    wrapper: 'h-auto p-0 py-2',
                }}
                maxWidth='full'
            >
                <div className='flex flex-col items-start select-none'>
                    <h1 className='text-lg font-bold'>Products List</h1>
                    <p className='text-muted-foreground text-[10px] sm:text-sm'>
                        Here you can find all of your products
                    </p>
                </div>
                {canManage && (
                    <Button
                        className='border-1.5 bg-default/20 min-w-fit rounded-sm border-dashed'
                        size='sm'
                        startContent={<Plus size={20} />}
                        variant='light'
                        onPress={() => {
                            setAddProduct(null)
                            onAddOpen()
                        }}
                    >
                        Add Product
                    </Button>
                )}
            </Navbar>
            <div className='border-border from-sidebar/60 to-sidebar grid grid-cols-2 rounded-xl border bg-gradient-to-br min-[1200px]:grid-cols-4'>
                {stats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>

            <Table
                aria-label='Inventory Management - Product Catalog'
                bottomContent={
                    showPagination ? (
                        <div className='flex items-center justify-center border-t p-3 sm:justify-between'>
                            <Button
                                className='bg-default/20 hidden sm:flex'
                                isDisabled={currentPage <= 1}
                                size='sm'
                                startContent={<ArrowLeft size={18} />}
                                variant='light'
                                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <Pagination
                                classNames={{ wrapper: 'gap-2' }}
                                page={currentPage}
                                radius='full'
                                size='sm'
                                total={totalPages}
                                onChange={setCurrentPage}
                            />
                            <Button
                                className='bg-default/20 hidden sm:flex'
                                endContent={<ArrowRight size={18} />}
                                isDisabled={currentPage >= totalPages}
                                size='sm'
                                onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    ) : null
                }
                bottomContentPlacement='outside'
                className='flex-1 gap-0 rounded-sm border'
                classNames={{
                    thead: 'divide-x [&>tr]:first:rounded-none',
                    th: 'border-y bg-transparent first:rounded-s-none last:rounded-e-none',
                    tr: '',
                    td: 'group-data-[first=true]/tr:first:before:rounded-ss-none group-data-[last=true]/tr:first:before:rounded-es-none group-data-[first=true]/tr:last:before:rounded-se-none group-data-[last=true]/tr:last:before:rounded-ee-none',
                    table: '',
                    tbody: 'divide-y',
                    wrapper: 'rounded-none bg-transparent p-0',
                }}
                selectionMode='multiple'
                shadow='none'
                topContent={
                    <div className='flex flex-col-reverse items-center gap-3 p-3 md:flex-row md:justify-between'>
                        {activeFilters && activeFilters.length > 0 ? (
                            <ScrollShadow
                                ref={scrollShadowRef}
                                hideScrollBar
                                className='flex gap-1.5 sm:max-w-[50%]'
                                orientation='horizontal'
                            >
                                {activeFilters.map((filter) => (
                                    <Chip
                                        key={filter.id}
                                        className='select-none'
                                        size='sm'
                                        variant='flat'
                                        onClose={filter.onRemove}
                                    >
                                        {filter.label}
                                    </Chip>
                                ))}
                            </ScrollShadow>
                        ) : (
                            <span className='hidden sm:flex sm:max-w-[50%]' />
                        )}

                        <div className='flex items-center gap-2 sm:max-w-[50%]'>
                            <Input
                                hotKey='P'
                                placeholder={`Search products . . .`}
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                            />
                            <Filter
                                brands={brands}
                                categories={categories}
                                statusOptions={statusOptions}
                            />
                        </div>
                    </div>
                }
                topContentPlacement='outside'
            >
                <TableHeader>
                    <TableColumn>Product</TableColumn>
                    <TableColumn>Compatibility</TableColumn>
                    <TableColumn>Purchase</TableColumn>
                    <TableColumn>Staff</TableColumn>
                    <TableColumn>Price</TableColumn>
                    <TableColumn align='center'>Quantity</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Total</TableColumn>
                    <TableColumn align='center'>Actions</TableColumn>
                </TableHeader>
                <TableBody emptyContent={'No rows to display.'}>
                    {paginatedProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className='max-w-64 min-w-32'>
                                <div className='truncate' title={product.name}>
                                    {product.name}
                                </div>
                            </TableCell>
                            <TableCell className='max-w-52 whitespace-nowrap'>
                                {product.compatible}
                            </TableCell>
                            <TableCell>{formatPrice(product.purchase ?? 0)}</TableCell>
                            <TableCell>{formatPrice(product.staff_price ?? 0)}</TableCell>

                            <TableCell>{formatPrice(product.price ?? 0)}</TableCell>
                            <TableCell className='min-w-16 text-center'>
                                <Quantity canManage={canManage} product={product} />
                            </TableCell>
                            <TableCell className='min-w-24'>
                                <Badge
                                    className={`rounded-sm border-none text-white ${getStockStatus(product.qty).color}`}
                                >
                                    {getStockStatus(product.qty).text}
                                </Badge>
                            </TableCell>
                            <TableCell>{formatPrice(product.purchase * product.qty)}</TableCell>
                            <TableCell align='center'>
                                {canManage && (
                                    <div className='flex items-center justify-center gap-2'>
                                        <Tooltip content={<p>Edit Product</p>}>
                                            <Button
                                                isIconOnly
                                                className='border'
                                                radius='full'
                                                size='sm'
                                                startContent={<Edit size={16} />}
                                                variant='light'
                                                onPress={() => handleEdit(product)}
                                            />
                                        </Tooltip>
                                        <Tooltip content={<p>Delete Product</p>}>
                                            <Button
                                                isIconOnly
                                                className='border'
                                                color='danger'
                                                radius='full'
                                                size='sm'
                                                startContent={<Delete />}
                                                variant='light'
                                                onPress={() => handleDelete(product)}
                                            />
                                        </Tooltip>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AddEdit
                brands={brand}
                isOpen={isAddOpen}
                mode='add'
                product={addProduct}
                onClose={onAddClose}
            />
            {/* Edit Modal */}
            <AddEdit
                brands={brand}
                isOpen={isEditOpen}
                mode='edit'
                product={editingProduct}
                onClose={onEditClose}
            />

            {/* Delete Modal */}
            <DeleteProduct
                isOpen={isDeleteOpen}
                product={deletingProduct}
                onClose={onDeleteClose}
            />
        </main>
    )
}

interface StatsCardProps {
    title: string
    value: string
    color?: string
}

function StatsCard({ title, value, color }: StatsCardProps) {
    return (
        <div className='group before:from-input/30 before:via-input before:to-input/30 relative p-4 before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b last:before:hidden lg:p-5'>
            <div className='relative flex items-center gap-4'>
                <RiArrowRightUpLine
                    aria-hidden='true'
                    className='absolute top-0 right-0 text-emerald-500 opacity-0 transition-opacity group-has-[a:hover]:opacity-100'
                    size={20}
                />

                <div>
                    <p className='text-muted-foreground/60 text-xs font-medium tracking-widest uppercase before:absolute before:inset-0'>
                        {title}
                    </p>
                    <div className={`mb-2 text-2xl font-semibold ${color}`}>{value}</div>
                </div>
            </div>
        </div>
    )
}
