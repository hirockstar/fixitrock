'use client'
import { Card, CardFooter, CardHeader, Image } from '@heroui/react'
import Link from 'next/link'

import { formatDateTime } from '@/lib/utils'
import { FRP } from '@/types/frp'

interface FRPCardProps {
    data: FRP[]
}
export default function FRPCard({ data }: FRPCardProps) {
    return (
        <section className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2'>
            {data?.map((f) => (
                <Card
                    key={f.id}
                    aria-label={f.title}
                    className='w-full rounded-2xl border bg-transparent'
                    shadow='none'
                >
                    <Link passHref href={f.link} target='_blank'>
                        <CardHeader className='mb-px p-2'>
                            <h1 className='line-clamp-1 text-start text-[13px]'>{f.title}</h1>
                        </CardHeader>
                        <Image
                            isBlurred
                            alt={f.title}
                            className='bg-default/5 dark:bg-default/10 aspect-video h-40 rounded-lg object-contain p-2'
                            classNames={{ wrapper: 'mx-auto' }}
                            loading='lazy'
                            src={f.img}
                        />
                        <CardFooter className='text-muted-foreground justify-end p-2 text-xs'>
                            <p>{formatDateTime(f.created_at)}</p>
                        </CardFooter>
                    </Link>
                </Card>
            ))}
        </section>
    )
}
