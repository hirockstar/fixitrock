'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'nextjs-toploader/app'

import { Icon } from '@/lib'
import { CommandGroup, CommandItem, CommandSeparator } from '@/ui/command'
import { useSearchStore } from '@/zustand/store'

export function QuickAction({ command }: { command: Group[] }) {
    const { page, onSelect } = useSearchStore()
    const { setTheme } = useTheme()
    const router = useRouter()
    const mergedGroups = [...command, ...Actions]

    if (page) {
        let expandedItem: Item | undefined
        let groupTitle = ''

        for (const group of mergedGroups) {
            const found = group.children.find((item) => item.id === page)

            if (found) {
                expandedItem = found
                groupTitle = found.title
                break
            }
        }
        if (expandedItem && expandedItem.children) {
            return (
                <>
                    <CommandGroup heading={groupTitle}>
                        {expandedItem.children.map((item) => (
                            <CommandItem
                                key={item.id}
                                onSelect={() => onSelect(item, router, setTheme)}
                            >
                                <div className='flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-sm border'>
                                    {item.icon && <Icon className='size-4' icon={item.icon} />}
                                </div>
                                <div className='flex w-full flex-1 flex-col items-start truncate'>
                                    {item.title && (
                                        <div className='text-sm font-medium'>{item.title}</div>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </>
            )
        }
    }

    return (
        <>
            {mergedGroups.map((group, idx) => (
                <React.Fragment key={group.id}>
                    <CommandGroup heading={group.title}>
                        {group.children.map((item) => (
                            <CommandItem
                                key={item.id}
                                value={item.title}
                                onSelect={() => onSelect(item, router, setTheme)}
                            >
                                <div className='flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-sm border'>
                                    {item.icon && <Icon className='size-4' icon={item.icon} />}
                                </div>
                                <div className='flex w-full flex-1 flex-col items-start truncate'>
                                    {item.title && (
                                        <div className='text-sm font-medium'>{item.title}</div>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    {idx < mergedGroups.length - 1 && <CommandSeparator />}
                </React.Fragment>
            ))}
        </>
    )
}

const Actions = [
    {
        id: 'general',
        title: 'General',
        children: [
            {
                id: 'home',
                title: 'Return to Home',
                icon: 'simple-icons:ghostery',
                href: '/',
            },
            {
                id: 'theme',
                title: 'Change Theme . . .',
                icon: 'fa7-solid:brush',
                action: { type: 'section' as const, value: 'theme' },
                children: [
                    {
                        id: 'light',
                        title: 'Change Theme to Light',
                        icon: 'line-md:moon-to-sunny-outline-loop-transition',
                        action: { type: 'theme' as const, value: 'light' },
                    },
                    {
                        id: 'system',
                        title: 'Change Theme to System',
                        icon: 'line-md:computer',
                        action: { type: 'theme' as const, value: 'system' },
                    },
                    {
                        id: 'dark',
                        title: 'Change Theme to Dark',
                        icon: 'line-md:sunny-outline-to-moon-alt-loop-transition',
                        action: { type: 'theme' as const, value: 'dark' },
                    },
                ],
            },
        ],
    },
    {
        id: 'help',
        title: 'Help',
        children: [
            {
                id: 'support',
                title: 'Contact Support',
                icon: 'bx:support',
                href: 'https://wa.me/919927241144',
            },
        ],
    },
]

export type Item = {
    id: string
    title: string
    description?: string
    keywords?: string[]
    shortcut?: string[]
    icon?: string
    href?: string
    action?: {
        type: 'theme' | 'section' | 'toast' | 'custom'
        value: string
    }
    children?: Item[]
}

export type Group = {
    id: string
    title: string
    children: Item[]
}
