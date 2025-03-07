'use client'
import { Button } from '@heroui/react'
import { useRouter } from 'nextjs-toploader/app'

import { cn } from '®/lib/utils'

type TitleActionProps = {
    title: string
    children: React.ReactNode
    href: string
    className?: string
}

export const TitleAction = ({ title, children, href, className }: TitleActionProps) => {
    const router = useRouter()

    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between px-2'>
                <h1 className='my-2 text-left text-xl font-bold md:text-3xl'>{title}</h1>
                <Button
                    className='h-[34px] rounded-lg bg-background/30 backdrop-blur data-[hover=true]:bg-muted/50'
                    onPress={() => router.push(href)}
                >
                    View All
                </Button>
            </div>
            <div className={cn(className)}>{children}</div>
        </div>
    )
}
