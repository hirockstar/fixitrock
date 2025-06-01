'use client'

import { Listbox, ListboxItem, ListboxSection } from '@heroui/react'
import { useTheme } from 'next-themes'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'

import { siteConfig } from '®config/site'

export function Suggestion({ setOpen }: { setOpen: (open: boolean) => void }) {
    const { setTheme } = useTheme()
    const router = useRouter()
    const handleRoute = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <Listbox autoFocus aria-label='Suggestion' classNames={{ base: 'p-0' }}>
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
