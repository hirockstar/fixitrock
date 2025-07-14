'use client'

import { Button, Textarea } from '@heroui/react'
import Link from 'next/link'

import { siteConfig } from '®config/site'
const suggestion = siteConfig.suggestion.filter((s) => s.title !== 'Home')

export default function Page() {
    return (
        <main className='flex min-h-[70vh] w-full items-center justify-center'>
            <div className='flex w-full max-w-xl flex-col items-center gap-4 px-3 sm:px-2 md:gap-6'>
                <h1 className='title-heading text-foreground mt-10 text-center text-2xl font-bold md:text-4xl'>
                    Welcome to Fix iT Rock
                </h1>
                <div>
                    <Textarea placeholder='Work in progress . . .' type='text' />
                    <div className='mt-4 flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1.5'>
                        {suggestion.map((s) => (
                            <Button
                                key={s.href}
                                passHref
                                aria-label={s.title}
                                as={Link}
                                className='border-1'
                                href={s.href}
                                radius='full'
                                startContent={
                                    typeof s.icon === 'function' ? (
                                        <s.icon
                                            className='text-muted-foreground mx-auto'
                                            size={18}
                                        />
                                    ) : null
                                }
                                variant='light'
                            >
                                {s.title}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
