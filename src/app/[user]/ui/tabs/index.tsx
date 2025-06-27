'use client'

import { Tab, Tabs as UiTabs } from '@heroui/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { User, TabsConfig } from '®app/login/types'
import { useTabs } from '®hooks/useTabs'

import { Quotes } from './quotes'
const COMPONENTS: Record<string, React.ComponentType<unknown>> = {
    Quotes: Quotes,
}

export default function Tabs(user: User & { tabs: TabsConfig[] }) {
    const { tab } = useTabs()

    let selectedKey = 'activity'

    if (tab.includes('tab=')) {
        const match = tab.match(/tab=([^&]+)/)

        if (match && match[1]) selectedKey = match[1]
    }

    const validTabKeys = user.tabs.map((t) => t.title.toLowerCase())

    if (selectedKey && !validTabKeys.includes(selectedKey)) {
        redirect(`/@${user.username}`)
    }

    return (
        <UiTabs
            classNames={{
                base: 'bg-background sticky top-0 z-20 w-full border-b py-0.5',
            }}
            selectedKey={selectedKey}
            variant='underlined'
        >
            {user.tabs.map((tab) => {
                const tabKey = tab.title.toLowerCase()
                const TabComponent = COMPONENTS[tab.component]
                const href =
                    tabKey === 'activity'
                        ? `/@${user.username}`
                        : `/@${user.username}?tab=${tabKey}`

                return (
                    <Tab key={tabKey} as={Link} href={href} title={tab.title}>
                        {TabComponent ? (
                            <TabComponent />
                        ) : (
                            <div className='text-muted-foreground relative mx-auto flex h-80 w-full flex-col items-center justify-center gap-2 text-center select-none'>
                                <div className='absolute -top-10 -left-10 h-32 w-32 rounded-full bg-pink-400/10 blur-2xl 2xl:bg-white dark:bg-pink-500/20' />
                                <div className='absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl dark:bg-blue-500/20' />
                                <div className='animate-fade-in relative z-10 flex flex-col items-center'>
                                    <span className='animate-bounce text-7xl'>✨</span>
                                    <div className='my-2 h-1 w-20 rounded-full bg-gradient-to-r from-pink-400 to-blue-400' />
                                    <span className='text-2xl font-bold text-gray-700 dark:text-gray-200'>
                                        Something new is coming!
                                    </span>
                                    <span className='max-w-md text-base text-gray-600 dark:text-gray-400'>
                                        You found a new tab! We're working hard to make it amazing
                                        for you. Stay tuned! 💫
                                    </span>
                                </div>
                            </div>
                        )}
                    </Tab>
                )
            })}
        </UiTabs>
    )
}
