'use client'
import { Card as Hero, CardFooter, CardHeader, Image } from '@heroui/react'
import Link from 'next/link'
import { z } from 'zod'

import { fromLeftVariant, fromTopVariant } from '®lib/FramerMotionVariants'
import { formatDateTime } from '®lib/utils'
import AnimatedDiv from '®ui/farmer/div'
import { MagicCard } from '®ui/magiccard'

export const CardSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1, 'Title cannot be empty'),
    img: z.string().url('Invalid URL for the image'),
    link: z.string().url('Invalid URL for the link'),
    count: z.number().int().nonnegative(),
    created_at: z.string().datetime('Invalid timestamp'),
})

export type CardType = z.infer<typeof CardSchema>

export function Card({ c }: { c: CardType }) {
    return (
        <AnimatedDiv
            key={c.id}
            className='relative select-none'
            mobileVariants={fromTopVariant}
            variants={fromLeftVariant}
        >
            <Hero
                aria-label={c.title}
                className='w-full rounded-2xl border bg-transparent'
                shadow='none'
            >
                <Link passHref href={c.link} target='_blank'>
                    <MagicCard>
                        <CardHeader className='mb-[1px] p-2'>
                            <h1 className='line-clamp-1 text-start text-[13px]'>{c.title}</h1>
                        </CardHeader>
                        <Image
                            isBlurred
                            alt={c.title}
                            className={`aspect-video h-40 rounded-lg bg-default/5 object-contain p-2 dark:bg-default/10`}
                            classNames={{ wrapper: 'mx-auto' }}
                            loading='lazy'
                            src={c.img}
                        />
                        <CardFooter className='justify-end p-2 text-xs text-muted-foreground'>
                            <p>{formatDateTime(c.created_at)}</p>
                        </CardFooter>
                    </MagicCard>
                </Link>
            </Hero>
        </AnimatedDiv>
    )
}
