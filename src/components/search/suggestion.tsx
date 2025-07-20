'use client'

import { Listbox, ListboxItem, ListboxSection } from '@heroui/react'
import { useTheme } from 'next-themes'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'
import * as Icons from 'lucide-react'

import { Navigation } from '®app/login/types'
import { siteConfig } from '®config/site'

export function Suggestion({
    navigation,
    setOpen,
}: {
    navigation: Navigation[]
    setOpen: (open: boolean) => void
}) {
    const { setTheme } = useTheme()
    const router = useRouter()
    const handleRoute = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <Listbox autoFocus aria-label='Suggestion' classNames={{ base: 'p-0' }}>
            {navigation !== null && navigation.length > 0 ? (
                <ListboxSection
                    classNames={{ base: 'mb-0 px-1.5', group: 'flex flex-col gap-1.5' }}
                    items={navigation}
                    title='Account'
                >
                    {navigation.map((n) => {
                        const iconName = n.icon.charAt(0).toUpperCase() + n.icon.slice(1)
                        const LucideIcon = Icons[iconName as keyof typeof Icons] as
                            | React.ElementType
                            | undefined

                        return (
                            <ListboxItem
                                key={n.title}
                                className='data-[hover=true]:bg-muted/50 rounded-md border'
                                href={n.href}
                                startContent={
                                    <div className='flex size-10 items-center rounded-lg border'>
                                        {LucideIcon ? (
                                            <LucideIcon
                                                className='text-muted-foreground mx-auto'
                                                size={18}
                                            />
                                        ) : null}
                                    </div>
                                }
                                textValue={n.href}
                                onPress={() => handleRoute(() => router.push(n.href))}
                            >
                                <div className='flex flex-col'>
                                    <h2 className='line-clamp-1 text-[15px] font-medium'>
                                        {n.title}
                                    </h2>
                                    <p className='text-muted-foreground line-clamp-1 text-xs'>
                                        {n.description}
                                    </p>
                                </div>
                            </ListboxItem>
                        )
                    })}
                </ListboxSection>
            ) : null}

            <ListboxSection
                classNames={{ base: 'mb-0 px-1.5', group: 'flex flex-col gap-1.5' }}
                title='Suggestion'
            >
                {siteConfig.suggestion.map((s) => (
                    <ListboxItem
                        key={s.title}
                        className='data-[hover=true]:bg-muted/50 rounded-md border'
                        startContent={
                            <div className='flex size-10 items-center rounded-lg border'>
                                <s.icon className='text-muted-foreground mx-auto' size={18} />
                            </div>
                        }
                        textValue={s.title}
                        onPress={() => handleRoute(() => router.push(s.href))}
                    >
                        <div className='flex flex-col'>
                            <h2 className='line-clamp-1 text-[15px] font-medium'>{s.title}</h2>
                            <p className='text-muted-foreground line-clamp-1 text-xs'>
                                {s.description}
                            </p>
                        </div>
                    </ListboxItem>
                ))}
            </ListboxSection>
            <ListboxSection
                classNames={{ base: 'px-1.5', group: 'flex flex-col gap-1.5' }}
                title='Theme'
            >
                {siteConfig.themes.map((t) => (
                    <ListboxItem
                        key={t.title}
                        className='data-[hover=true]:bg-muted/50 rounded-md border'
                        startContent={
                            <div className='flex size-10 items-center rounded-lg border'>
                                <t.icon className='text-muted-foreground mx-auto' size={18} />
                            </div>
                        }
                        textValue={t.title}
                        onPress={() => setTheme(t.theme)}
                    >
                        <div className='flex flex-col'>
                            <h2 className='line-clamp-1 text-[15px] font-medium'>{t.title}</h2>
                            <p className='text-muted-foreground line-clamp-1 text-xs'>
                                {t.description}
                            </p>
                        </div>
                    </ListboxItem>
                ))}
            </ListboxSection>
        </Listbox>
    )
}
