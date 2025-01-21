'use client'

import { Card, Image } from '@heroui/react'
import Link from 'next/link'
import { cn } from '®/lib/utils'

export const UL = ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => {
    return <ul className={cn('ml-6 list-disc', className)} {...props} />
}

export const OL = ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => {
    return <ol className={cn('ml-6 list-decimal', className)} {...props} />
}

export const LI = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    return <li className={cn('mt-2', className)} {...props} />
}

export const Blockquote = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    return (
        <Card className={cn('rounded-lg border p-1.5 dark:bg-default/10', className)} shadow='none'>
            <blockquote
                className={cn('ml-1 border-l-2 border-[hsl(var(--ring))] pl-4 italic', className)}
                {...props}
            />
        </Card>
    )
}

export const HR = ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => {
    return <hr className={cn('my-2 border-border sm:my-6', className)} {...props} />
}

export const A = ({ className, ...props }: React.ComponentProps<typeof Link>) => {
    return (
        <Link
            className={cn(
                'underline decoration-[hsl(var(--ring))] decoration-wavy underline-offset-4',
                className
            )}
            {...props}
        />
    )
}

type Props = {
    src: string
    alt?: string
    width?: string
    height?: string
}

export const IMG = ({ src, alt, width, height }: Props) => {
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            className='mx-auto my-2'
            removeWrapper
            radius='lg'
            height={height}
            isBlurred
        />
    )
}
