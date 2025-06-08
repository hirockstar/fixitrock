'use client'
import { MapPin, Receipt } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardBody, CardHeader } from '@heroui/react'
import Link from 'next/link'

import { formatDateTime } from '®lib/utils'
import { Invoice } from '®types/invoice'
import { Separator } from '®ui/separator'

export default function InvoiceCard(invoice: Invoice) {
    return (
        <Card
            isPressable
            passHref
            as={Link}
            className='rounded-2xl border border-dashed bg-transparent'
            href={`/invoice/${invoice.id}`}
            shadow='none'
        >
            <CardBody className='p-0'>
                <div className='bg-muted/30 flex items-center justify-between border-b border-dashed px-6 py-2'>
                    <div className='flex items-center gap-2'>
                        <Receipt className='text-muted-foreground h-4 w-4' />
                        <span className='text-muted-foreground text-xs font-medium'>
                            INVOICE #{invoice?.id?.toString().padStart(4, '0')}
                        </span>
                    </div>
                </div>

                <CardHeader className='flex w-full flex-col px-6 py-4'>
                    <div className='flex w-full items-start justify-between'>
                        <h3 className='text-2xl font-semibold'>{invoice.product}</h3>
                        <span className='text-muted-foreground text-xs'>
                            {format(invoice.created_at, 'MMM d, yyyy')}
                        </span>
                    </div>
                    <p className='text-muted-foreground w-full text-start text-sm'>
                        <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                            Seller:
                        </span>{' '}
                        {invoice.seller}
                    </p>
                </CardHeader>

                <Separator />

                <div className='flex items-center justify-between px-6 py-2'>
                    <div className='flex items-center gap-1.5'>
                        <MapPin className='text-muted-foreground h-4 w-4' />
                        <span className='text-muted-foreground text-sm'>{invoice.location}</span>
                    </div>
                    <span className='text-muted-foreground text-xs'>
                        {formatDateTime(invoice.created_at)}
                    </span>
                </div>
            </CardBody>
        </Card>
    )
}
