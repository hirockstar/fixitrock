'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button, Card, CardBody, CardHeader, Input, Navbar, Skeleton } from '@heroui/react'
import { Edit, MapPin, Plus, Receipt, Search } from 'lucide-react'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { useRouter } from 'nextjs-toploader/app'

import { useSupabse } from '®hooks/tanstack/query'
import { Separator } from '®ui/separator'
import { formatDateTime } from '®lib/utils'
import { Invoice } from '®types/invoice'
import AnimatedDiv from '®ui/farmer/div'
import { BlogCardAnimation, fromLeftVariant } from '®lib/FramerMotionVariants'

import InvoiceModal from '../ui/modal'
import LoginModal from '../ui/login'
import { usePasswordGate } from '../hooks/usePasswordGate'

export default function InvoicePage() {
    const router = useRouter()
    const { data: invoices, isLoading } = useSupabse<Invoice>('invoice')
    const { isLoggedIn, login, logout } = usePasswordGate({
        storageKey: 'invoice-password',
        adminPassword: process.env.NEXT_PUBLIC_INVOICE_PASSWORD as string,
    })
    const [loginOpen, setLoginOpen] = useState(false)

    const [openModal, setOpenModal] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<Partial<Invoice> | undefined>()
    const [search, setSearch] = useState('')

    const handleAdd = () => {
        setSelectedInvoice(undefined)
        setOpenModal(true)
    }

    const handleEdit = (invoice: Invoice) => {
        setSelectedInvoice(invoice)
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedInvoice(undefined)
    }

    const filteredInvoices = invoices?.filter((invoice) => {
        const searchValue = search.toLowerCase()
        const numberMatch = invoice.number.toString().includes(searchValue)
        const productMatch = invoice.product.toLowerCase().includes(searchValue)
        const sellerMatch = invoice.seller.toLowerCase().includes(searchValue)

        return numberMatch || productMatch || sellerMatch
    })

    return (
        <div className='mx-auto flex flex-col gap-2'>
            <Navbar
                shouldHideOnScroll
                classNames={{
                    wrapper: 'h-auto w-full flex-col gap-1 p-0 py-1 sm:flex-row',
                }}
                maxWidth='full'
            >
                <div className='hidden h-10 w-full select-none items-center gap-1.5 sm:flex'>
                    <h1 className='text-base font-bold sm:text-lg'>Invoice</h1>
                </div>
                <div className='flex w-full select-none items-center gap-2'>
                    <Input
                        className='bg-transparent'
                        classNames={{
                            inputWrapper:
                                'h-10 min-h-10 w-full rounded-full border bg-transparent shadow-none data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
                        }}
                        placeholder='Search by number or product or seller'
                        startContent={<Search className='h-4 w-4 shrink-0' />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {isLoggedIn && (
                        <Button
                            isIconOnly
                            className='border'
                            radius='full'
                            startContent={<Plus size={24} />}
                            variant='light'
                            onPress={handleAdd}
                        />
                    )}
                    <InvoiceModal
                        initialData={selectedInvoice}
                        isOpen={openModal}
                        onClose={handleCloseModal}
                    />
                    <Button
                        isIconOnly
                        color={isLoggedIn ? 'danger' : 'default'}
                        radius='full'
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
                    <LoginModal
                        isOpen={loginOpen}
                        label='Enter Password'
                        onClose={() => setLoginOpen(false)}
                        onSubmit={(val) => login(val)}
                    />
                </div>
            </Navbar>

            <div className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-2'>
                {isLoading ? (
                    <InvoiceSkeleton />
                ) : filteredInvoices?.length ? (
                    filteredInvoices.map((invoice) => (
                        <AnimatedDiv
                            key={invoice.id}
                            mobileVariants={BlogCardAnimation}
                            variants={fromLeftVariant}
                        >
                            <Card
                                fullWidth
                                isPressable
                                className='cursor-pointer rounded-2xl border border-dashed bg-transparent shadow-none'
                                onPress={() => router.push(`/invoice/${invoice.id}`)}
                            >
                                <CardBody className='p-0'>
                                    <div className='flex items-center justify-between border-b border-dashed bg-muted/30 px-6 py-2'>
                                        <div className='flex items-center gap-2'>
                                            <Receipt className='h-4 w-4 text-muted-foreground' />
                                            <span className='text-xs font-medium text-muted-foreground'>
                                                INVOICE #
                                                {invoice?.number.toString().padStart(4, '0')}
                                            </span>
                                        </div>
                                        {isLoggedIn && (
                                            <Button
                                                isIconOnly
                                                className='border'
                                                radius='full'
                                                size='sm'
                                                startContent={<Edit size={20} />}
                                                variant='light'
                                                onPress={() => handleEdit(invoice)}
                                            />
                                        )}
                                    </div>

                                    <CardHeader className='flex w-full flex-col px-6 py-4'>
                                        <div className='flex w-full items-start justify-between'>
                                            <h3 className='text-2xl font-semibold'>
                                                {invoice.product}
                                            </h3>
                                            <span className='text-xs text-muted-foreground'>
                                                {format(invoice.created_at, 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        <p className='w-full text-start text-sm text-muted-foreground'>
                                            <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                                                Seller:
                                            </span>{' '}
                                            {invoice.seller}
                                        </p>
                                    </CardHeader>

                                    <Separator />

                                    <div className='flex items-center justify-between px-6 py-2'>
                                        <div className='flex items-center gap-1.5'>
                                            <MapPin className='h-4 w-4 text-muted-foreground' />
                                            <span className='text-sm text-muted-foreground'>
                                                {invoice.location}
                                            </span>
                                        </div>
                                        <span className='text-xs text-muted-foreground'>
                                            {formatDateTime(invoice.created_at)}
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>
                        </AnimatedDiv>
                    ))
                ) : (
                    <div className='col-span-full text-center text-sm text-muted-foreground'>
                        No invoices found.
                    </div>
                )}
            </div>
        </div>
    )
}

const InvoiceSkeleton = ({ length = 12 }: { length?: number }) => {
    return (
        <>
            {Array.from({ length }).map((_, index) => (
                <Card
                    key={index}
                    className='rounded-2xl border border-dashed bg-transparent shadow-none'
                >
                    <CardBody className='p-0'>
                        <div className='flex items-center justify-between border-b border-dashed bg-muted/30 px-6 py-2'>
                            <div className='flex items-center gap-2'>
                                <Receipt className='h-4 w-4 text-muted-foreground' />
                                <Skeleton className='h-4 w-24 rounded-sm' />
                            </div>
                            <Skeleton className='h-8 w-8 rounded-full' />
                        </div>

                        <CardHeader className='flex w-full flex-col items-start gap-2 px-6 py-4'>
                            <div className='flex w-full items-center justify-between'>
                                <Skeleton className='h-7 w-40 rounded-sm' />
                                <Skeleton className='h-4 w-20 rounded-sm' />
                            </div>
                            <span className='flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400'>
                                Seller:
                                <Skeleton className='h-4 w-20 rounded-sm' />
                            </span>
                        </CardHeader>

                        <Separator />

                        <div className='flex items-center justify-between px-6 py-2'>
                            <div className='flex items-center gap-1.5'>
                                <MapPin className='h-4 w-4 text-muted-foreground' />

                                <Skeleton className='h-4 w-28 rounded-sm' />
                            </div>

                            <Skeleton className='h-4 w-20 rounded-sm' />
                        </div>
                    </CardBody>
                </Card>
            ))}
        </>
    )
}
