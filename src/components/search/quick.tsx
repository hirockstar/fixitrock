'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { useTheme } from 'next-themes'

import { Icon } from '@/lib'
import { CommandEmpty, CommandGroup, CommandItem } from '@/ui/command'
import { useSearchStore } from '@/zustand/store'
import { capitalize } from '@/lib/utils'

import { Navigations } from './type'

export function QuickAction({ command }: { command: Record<string, Navigations> | null }) {
    const router = useRouter()
    const { setTheme } = useTheme()
    const { setDynamicNavigations, getNavigationGroups, onSelect } = useSearchStore()

    useEffect(() => {
        setDynamicNavigations({ ...command, ...actions })
    }, [command, setDynamicNavigations])

    const groups = getNavigationGroups()

    return (
        <>
            {groups.map((group) => (
                <CommandGroup key={group.heading} heading={capitalize(group.heading)}>
                    {group.navigationItems?.map((item) => (
                        <CommandItem
                            key={item.id}
                            onSelect={() => onSelect(item, router, setTheme)}
                        >
                            {item.icon && <Icon className='size-6' icon={item.icon} />}
                            <div className='ml-0.5 flex w-full flex-1 flex-col items-start truncate'>
                                {item.title && (
                                    <div className='text-sm font-medium'>{item.title}</div>
                                )}
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            ))}
            <CommandEmpty>No Results Found</CommandEmpty>
        </>
    )
}

const actions: Record<string, Navigations> = {
    space: [
        {
            id: 'space',
            title: 'Search Firmwares . . .',
            icon: 'fluent:phone-link-setup-24-regular',
            action: { type: 'tab', value: 'space' },
            keywords: ['search', 'firmware', 'phone', 'device', 'flash'],
        },
        {
            id: 'space-frp',
            title: 'FRP Bypass',
            icon: 'hugeicons:phone-lock',
            href: '/frp',
            keywords: ['frp', 'bypass', 'google', 'lock', 'android'],
        },
        {
            id: 'space-flash-tool',
            title: 'Flashing Tools',
            icon: 'hugeicons:phone-arrow-up',
            href: '/space/flash-tool',
            keywords: ['flash', 'tools', 'firmware', 'update', 'phone'],
        },
        {
            id: 'space-spare-parts',
            title: 'Spare Parts Price',
            description: 'Find genuine mobile parts and authorized service centers near you',
            icon: 'mynaui:rupee-waves',
            href: '/scpl',
            keywords: ['spare', 'parts', 'price', 'mobile', 'repair'],
        },
    ],
    general: [
        {
            id: 'home',
            title: 'Return to Home',
            icon: 'simple-icons:ghostery',
            href: '/',
            keywords: ['home', 'go back', 'main', 'start', 'homepage'],
        },
        {
            id: 'theme',
            title: 'Change Theme . . .',
            icon: 'fa7-solid:brush',
            action: { type: 'section', value: 'theme' },
            keywords: ['theme', 'appearance', 'light', 'dark', 'mode', 'color'],
            children: [
                {
                    id: 'light',
                    title: 'Change Theme to Light',
                    icon: 'line-md:moon-to-sunny-outline-loop-transition',
                    action: { type: 'theme', value: 'light' },
                    keywords: ['light', 'bright', 'day', 'theme', 'mode'],
                },
                {
                    id: 'system',
                    title: 'Change Theme to System',
                    icon: 'line-md:computer',
                    action: { type: 'theme', value: 'system' },
                    keywords: ['system', 'auto', 'follow', 'device', 'theme'],
                },
                {
                    id: 'dark',
                    title: 'Change Theme to Dark',
                    icon: 'line-md:sunny-outline-to-moon-alt-loop-transition',
                    action: { type: 'theme', value: 'dark' },
                    keywords: ['dark', 'night', 'theme', 'mode', 'black'],
                },
            ],
        },
    ],
    help: [
        {
            id: 'support',
            title: 'Contact Support',
            icon: 'bx:support',
            href: 'https://wa.me/919927241144',
            keywords: ['support', 'help', 'contact', 'whatsapp', 'customer'],
        },
    ],
}
