'use client'

import { Listbox, ListboxItem, ListboxSection } from '@heroui/react'
import { useTheme } from 'next-themes'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'

import { suggestion, themes } from '®/config/suggestion'

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
                {suggestion.map((s) => (
                    <ListboxItem
                        key={s.title}
                        className='border data-[hover=true]:bg-muted/50'
                        startContent={
                            <div className='flex size-10 items-center rounded-lg border'>
                                {s.icon}
                            </div>
                        }
                        textValue={s.title}
                        onPress={() => handleRoute(() => router.push(s.href))}
                    >
                        <div className='flex flex-col'>
                            <h2 className='line-clamp-1 text-[15px] font-medium'>{s.title}</h2>
                            <p className='line-clamp-1 text-xs text-muted-foreground'>
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
                {themes.map((t) => (
                    <ListboxItem
                        key={t.title}
                        className='border data-[hover=true]:bg-muted/50'
                        startContent={
                            <div className='flex size-10 items-center rounded-lg border'>
                                {t.icon}
                            </div>
                        }
                        textValue={t.title}
                        onPress={() => setTheme(t.theme)}
                    >
                        <div className='flex flex-col'>
                            <h2 className='line-clamp-1 text-[15px] font-medium'>{t.title}</h2>
                            <p className='line-clamp-1 text-xs text-muted-foreground'>
                                {t.description}
                            </p>
                        </div>
                    </ListboxItem>
                ))}
            </ListboxSection>
        </Listbox>
    )
}
