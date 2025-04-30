'use client'

import { Image } from '@heroui/react'

import { useSupabse } from '®hooks/tanstack/query'
import { Category } from '®types/invoice'

type Props = {
    name: string
}

export function CategoryIcon({ name }: Props) {
    const { data, isLoading } = useSupabse<Category>('category')

    const match = data?.find((item) => item.name === name)

    if (!match) return null

    return (
        <div className='mx-auto flex w-10 items-center justify-center'>
            <Image
                alt={match.name}
                className='size-10 rounded object-contain'
                isLoading={isLoading}
                src={match.image_url}
            />
        </div>
    )
}
