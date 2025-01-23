'use client'
import { Card, CardFooter, CardHeader, Image } from '@heroui/react'
import Link from 'next/link'
import { z } from 'zod'

import { fromLeftVariant, fromTopVariant } from '®/lib/FramerMotionVariants'
import { formatDateTime } from '®/lib/utils'
import AnimatedDiv from '®/ui/farmer/div'
import { MagicCard } from '®/ui/magiccard'

export const FRPSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1, 'Title cannot be empty'),
    img: z.string().url('Invalid URL for the image'),
    link: z.string().url('Invalid URL for the link'),
    count: z.number().int().nonnegative(),
    created_at: z.string().datetime('Invalid timestamp'),
})

export type FRPType = z.infer<typeof FRPSchema>

export function FRPCard({ f }: { f: FRPType }) {
    return (
        <AnimatedDiv
            key={f.id}
            className='relative select-none'
            mobileVariants={fromTopVariant}
            variants={fromLeftVariant}
        >
            <Card
                aria-label={f.title}
                className='w-full rounded-2xl border bg-transparent'
                shadow='none'
            >
                <Link passHref href={f.link} target='_blank'>
                    <MagicCard>
                        <CardHeader className='mb-[1px] p-2'>
                            <h1 className='line-clamp-1 text-start text-[13px]'>{f.title}</h1>
                        </CardHeader>
                        <Image
                            isBlurred
                            alt={f.title}
                            className={`aspect-video h-40 rounded-lg bg-default/5 object-contain p-2 dark:bg-default/10`}
                            classNames={{ wrapper: 'mx-auto' }}
                            loading='lazy'
                            src={f.img}
                        />
                        <CardFooter className='justify-end p-2 text-xs text-muted-foreground'>
                            <p>{formatDateTime(f.created_at)}</p>
                        </CardFooter>
                    </MagicCard>
                </Link>
            </Card>
        </AnimatedDiv>
    )
}
