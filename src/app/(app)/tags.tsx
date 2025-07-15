'use client'
import type { Navigation } from '../login/types'
import type { SVGProps } from 'react'

import { Button, Textarea } from '@heroui/react'
import Link from 'next/link'
import * as Icons from 'lucide-react'

import { siteConfig } from '®config/site'

export function Tags({ navigation = [] }: { navigation?: Navigation[] }) {
    const suggestion = siteConfig.suggestion.filter((s) => s.title !== 'Home')
    const navigationWithIcons = navigation.map((nav) => {
        let iconComp: React.ElementType<SVGProps<SVGSVGElement>> | undefined

        if (nav.icon && nav.icon in Icons) {
            iconComp = Icons[nav.icon as keyof typeof Icons] as React.ElementType<
                SVGProps<SVGSVGElement>
            >
        }

        return {
            ...nav,
            icon: iconComp,
        }
    })
    const allTags = [...navigationWithIcons, ...suggestion]

    return (
        <div>
            <Textarea maxRows={2} placeholder='Work in progress . . .' size='lg' type='text' />
            <div className='mt-4 flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-2'>
                {allTags.map((s) => {
                    const Icon = s.icon as React.ElementType<SVGProps<SVGSVGElement>> | undefined

                    return (
                        <Button
                            key={s.href}
                            passHref
                            aria-label={s.title}
                            as={Link}
                            className='border-1'
                            href={s.href}
                            radius='full'
                            startContent={
                                Icon ? (
                                    <Icon className='text-muted-foreground mx-auto size-5' />
                                ) : null
                            }
                            variant='light'
                        >
                            {s.title}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
