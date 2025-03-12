'use client'
import { Card, CardFooter, CardHeader, Image } from '@heroui/react'
import Link from 'next/link'
import { SiSupabase } from 'react-icons/si'
import { TbDatabaseStar, TbPlugConnectedX } from 'react-icons/tb'
import { formatDateTime } from '®lib/utils'
import { useSupabse } from '®tanstack/query'
import { GridSkeleton } from '®ui/skeleton'
import { ErrorState } from '®ui/state'

export default function Page() {
    const { data, isLoading, error } = useSupabse('frp')
    return (
        <section className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-2'>
            {isLoading ? (
                <GridSkeleton />
            ) : error ? (
                <ErrorState
                    icons={[TbDatabaseStar, SiSupabase, TbPlugConnectedX]}
                    message={error.message}
                    title='Yo, FRP Data is MIA'
                />
            ) : (
                data?.map((f) => (
                    <Card
                        aria-label={f.title}
                        className='w-full rounded-2xl border bg-transparent'
                        shadow='none'
                    >
                        <Link passHref href={f.link} target='_blank'>
                            <CardHeader className='mb-[1px] p-2'>
                                <h1 className='line-clamp-1 text-start text-[13px]'>{f.title}</h1>
                            </CardHeader>
                            <Image
                                isBlurred
                                alt={f.title}
                                className='aspect-video h-40 rounded-lg bg-default/5 object-contain p-2 dark:bg-default/10'
                                classNames={{ wrapper: 'mx-auto' }}
                                loading='lazy'
                                src={f.img}
                            />
                            <CardFooter className='justify-end p-2 text-xs text-muted-foreground'>
                                <p>{formatDateTime(f.created_at)}</p>
                            </CardFooter>
                        </Link>
                    </Card>
                ))
            )}
        </section>
    )
}
