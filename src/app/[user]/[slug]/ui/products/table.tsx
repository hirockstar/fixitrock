'use client'

import { useState, useMemo } from 'react'
import {
    Button,
    Tooltip,
    useDisclosure,
    Autocomplete,
    AutocompleteItem,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import React from 'react'
import { Edit, Filter, Plus, CloudDownload } from 'lucide-react'

import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from '®ui/table'
import { Product } from '®types/products'
import { Brand } from '®types/brands'
import { formatPrice, getStockStatus } from '®lib/utils'
import { Delete } from '®ui/icons'
import { Input } from '®app/(space)/ui'

import DeleteProduct from './delete'
import AddEdit from './add'
import Quantity from './quantity'

interface ProductsTableProps {
    products: Product[]
    canManage: boolean
    brand: Brand[]
}

export default function ProductsTable({ products, canManage, brand }: ProductsTableProps) {
    const [addProduct, setAddProduct] = useState<Product | null>(null)

    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedBrand, setSelectedBrand] = useState<string>('all')
    const [selectedStatus, setSelectedStatus] = useState<string>('all')

    // Use useDisclosure for all modals
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

    // Get unique categories and brands for filters
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))]

        return ['all', ...uniqueCategories]
    }, [products])

    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))]

        return ['all', ...uniqueBrands]
    }, [products])

    // Status options
    const statusOptions = [
        { key: 'all', label: 'All' },
        { key: 'in', label: 'In Stock' },
        { key: 'low', label: 'Low Stock' },
        { key: 'out', label: 'Out of Stock' },
    ]

    // Filter products based on search and filters
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                searchTerm === '' ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.compatible.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesCategory =
                selectedCategory === 'all' || product.category === selectedCategory
            const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand

            // Status filter
            let matchesStatus = true

            if (selectedStatus !== 'all') {
                const statusText = getStockStatus(product.qty).text
                const selectedLabel = statusOptions.find((s) => s.key === selectedStatus)?.label

                matchesStatus = statusText === selectedLabel
            }

            return matchesSearch && matchesCategory && matchesBrand && matchesStatus
        })
    }, [products, searchTerm, selectedCategory, selectedBrand, selectedStatus])

    // Calculate totals
    const { totalPrice, totalProducts } = useMemo(() => {
        const total = filteredProducts.reduce((acc, product) => {
            return acc + product.purchase * product.qty
        }, 0)

        return {
            totalPrice: total,
            totalProducts: filteredProducts.length,
        }
    }, [filteredProducts])

    // Column visibility state
    const [visibleColumns] = useState<string[]>([
        'product',
        'compatibility',
        'price',
        'qty',
        'status',
        'total',
        'actions',
    ])
    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        onEditOpen()
    }

    const handleDelete = (product: Product) => {
        setDeletingProduct(product)
        onDeleteOpen()
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedCategory('all')
        setSelectedBrand('all')
        setSelectedStatus('all')
    }

    const hasActiveFilters =
        searchTerm !== '' ||
        selectedCategory !== 'all' ||
        selectedBrand !== 'all' ||
        selectedStatus !== 'all'

    return (
        <div className='space-y-4'>
            <div className='w-ful flex flex-col gap-4 md:flex-row'>
                <div className='sticky top-0 w-full md:max-w-xs'>
                    <Input
                        base='w-full md:max-w-xs'
                        hotKey='F'
                        placeholder={`Search products . . .`}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                </div>
                <div className='flex w-full gap-4'>
                    <Autocomplete
                        name='category'
                        placeholder='Choose category'
                        radius='sm'
                        selectedKey={selectedCategory === 'all' ? null : selectedCategory}
                        onClear={() => setSelectedCategory('all')}
                        onSelectionChange={(key) => setSelectedCategory(key as string)}
                    >
                        {categories
                            .filter((c) => c !== 'all')
                            .map((c) => (
                                <AutocompleteItem key={c}>{c}</AutocompleteItem>
                            ))}
                    </Autocomplete>
                    <Autocomplete
                        items={brand}
                        name='brand'
                        placeholder='Choose brand'
                        radius='sm'
                        selectedKey={selectedBrand === 'all' ? null : selectedBrand}
                        onClear={() => setSelectedBrand('all')}
                        onSelectionChange={(key) => setSelectedBrand(key as string)}
                    >
                        {brands
                            .filter((c) => c !== 'all')
                            .map((c) => (
                                <AutocompleteItem key={c}>{c}</AutocompleteItem>
                            ))}
                    </Autocomplete>
                </div>
                <div className='flex w-full gap-4'>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                fullWidth
                                className='h-10 rounded-md border shadow-none'
                                variant='light'
                            >
                                {selectedStatus === 'all'
                                    ? 'Status'
                                    : statusOptions.find((s) => s.key === selectedStatus)?.label ||
                                      'Status'}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label='Status Filter'
                            selectedKeys={selectedStatus ? [selectedStatus] : []}
                            selectionMode='single'
                            onSelectionChange={(keys) => {
                                const key = Array.from(keys)[0] as string

                                setSelectedStatus(key)
                            }}
                        >
                            <DropdownSection>
                                {statusOptions.map((s) => (
                                    <DropdownItem key={s.key}>{s.label}</DropdownItem>
                                ))}
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                    <Button
                        fullWidth
                        className='h-10 rounded-md border shadow-none'
                        startContent={<CloudDownload size={20} />}
                        variant='light'
                    >
                        Export
                    </Button>
                    {canManage && (
                        <Button
                            fullWidth
                            className='h-10 rounded-md border-none shadow-none'
                            color='primary'
                            startContent={<Plus size={20} />}
                            onPress={() => {
                                setAddProduct(null)
                                onAddOpen()
                            }}
                        >
                            Add Product
                        </Button>
                    )}
                </div>
            </div>
            {/* Table */}
            <div className='rounded-lg border'>
                <Table aria-label='Products Table' className='overflow-clip rounded-md border'>
                    <TableHeader>
                        <TableRow className='bg-muted/50 select-none [&>:not(:last-child)]:border-r'>
                            <TableCell align='center'>Product</TableCell>
                            <TableCell align='center'>Compatibility</TableCell>
                            {visibleColumns.includes('purchase') && (
                                <TableCell align='center'>Purchase</TableCell>
                            )}
                            {visibleColumns.includes('staff') && (
                                <TableCell align='center'>Staff</TableCell>
                            )}
                            <TableCell align='center'>Price</TableCell>
                            <TableCell align='center'>Qty</TableCell>
                            <TableCell align='center'>Status</TableCell>
                            <TableCell align='center'>Total</TableCell>
                            <TableCell align='center'>Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell className='py-8 text-center' colSpan={9}>
                                    <div className='text-muted-foreground flex flex-col items-center gap-2'>
                                        <Filter size={24} />
                                        <p className='text-sm'>
                                            No products found matching your filters
                                        </p>
                                        {hasActiveFilters && (
                                            <Button
                                                size='sm'
                                                variant='light'
                                                onPress={clearFilters}
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className='*:border-border [&>:not(:last-child)]:border-r'
                                >
                                    <TableCell align='center' className='text-nowrap'>
                                        {product.name}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        className='max-w-2xs min-w-3xs whitespace-normal'
                                    >
                                        {product.compatible}
                                    </TableCell>
                                    {visibleColumns.includes('purchase') && (
                                        <TableCell align='center'>
                                            {formatPrice(product.purchase)}
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes('staff') && (
                                        <TableCell align='center'>
                                            {formatPrice(product.staff_price ?? 0)}
                                        </TableCell>
                                    )}
                                    <TableCell align='center'>
                                        {formatPrice(product.price ?? 0)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Quantity canManage={canManage} product={product} />
                                    </TableCell>
                                    <TableCell align='center'>
                                        {getStockStatus(product.qty).text}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {formatPrice(product.purchase * product.qty)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {canManage && (
                                            <div className='flex items-center justify-center gap-4'>
                                                <Tooltip content={<p>Edit</p>}>
                                                    <Button
                                                        isIconOnly
                                                        className='border'
                                                        radius='full'
                                                        size='sm'
                                                        startContent={<Edit size={18} />}
                                                        variant='light'
                                                        onPress={() => handleEdit(product)}
                                                    />
                                                </Tooltip>
                                                <Tooltip content={<p>Delete</p>}>
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
                            ))
                        )}
                    </TableBody>
                    <TableFooter className='bg-muted/20'>
                        <TableRow className='hover:bg-transparent'>
                            <TableCell
                                className='font-medium'
                                colSpan={
                                    5 +
                                    (visibleColumns.includes('purchase') ? 1 : 0) +
                                    (visibleColumns.includes('staff') ? 1 : 0)
                                }
                            >
                                Total {totalProducts}
                            </TableCell>
                            <TableCell align='center' className='text-lg font-bold'>
                                {formatPrice(totalPrice)}
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
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
        </div>
    )
}
