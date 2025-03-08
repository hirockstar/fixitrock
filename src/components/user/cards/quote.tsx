'use client'
import { Card, CardBody } from '@heroui/react'

import { formatDateTime } from '®/lib/utils'

export type QuoteProps = {
    id: string
    quote: string
    username: string
    lastModifiedDateTime: string
}

export function Quote({ q }: { q: QuoteProps }) {
    return (
        <Card
            isPressable
            className='flex select-none flex-col justify-between bg-muted shadow-none'
        >
            <CardBody className='flex flex-1 flex-col'>
                <p className='flex h-[180px] items-center justify-center text-balance text-center font-serif text-xl font-bold'>
                    "{q.quote}"
                </p>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{formatDateTime(q.lastModifiedDateTime)}</span>
                    <span>— Rock Star 💕</span>
                </div>
            </CardBody>
        </Card>
    )
}
