'use client'
import React from 'react'
import { Button, Tab, Tabs } from '@heroui/react'
import { ArrowLeft, SearchIcon, X } from 'lucide-react'

import AnimatedSearch from '@/ui/farmer/search'
import { Command, CommandInput, CommandList } from '@/ui/command'
import { Download } from '@/app/(space)/ui/download'
import { Icon } from '@/lib'
import { useSearchStore } from '@/zustand/store'
import { User as UserType } from '@/app/login/types'
import { getSearchPlaceholder } from '@/lib/utils'

import { QuickAction } from './quick'
import { Space } from './space'
import { Navigations } from './type'

export function SearchBar({
    user,
    children,
    command,
}: {
    user: UserType | null
    children: React.ReactNode
    command: Record<string, Navigations> | null
}) {
    const {
        open,
        setOpen,
        bounce,
        onKeyDown,
        query,
        page,
        setPage,
        setQuery,
        tab,
        setTab,
        shouldFilter,
        setShouldFilter,
        ref,
        heading,
    } = useSearchStore()
    const tabs = [
        { key: 'actions', title: 'Suggestions', icon: 'pajamas:suggestion-ai', shouldFilter: true },
        {
            key: 'space',
            title: 'Space',
            icon: 'fluent:phone-link-setup-24-regular',
            shouldFilter: false,
        },
    ] as const

    return (
        <AnimatedSearch open={open} setOpen={setOpen}>
            <Command
                ref={ref}
                loop
                className={open ? 'h-[50vh] md:rounded-lg md:border' : 'rounded-lg border'}
                shouldFilter={shouldFilter}
                onKeyDown={onKeyDown}
            >
                {open && (
                    <>
                        <CommandList>
                            {tab === 'actions' && <QuickAction command={command} />}
                            {tab === 'space' && <Space />}
                        </CommandList>

                        <Tabs
                            classNames={{
                                base: 'h-10 items-center border-y bg-transparent',
                                tabList: 'gap-1.5',
                                tab: 'h-auto rounded-sm border px-2 shadow-none',
                                cursor: 'dark:bg-default/20 bg-default/20 overflow-hidden rounded text-white shadow-none',
                                tabContent: 'group-data-[selected=true]:text-foreground',
                            }}
                            selectedKey={tab}
                            size='sm'
                            variant='light'
                            onSelectionChange={(key) => {
                                const selectedTab = tabs.find((t) => t.key === key)

                                if (!selectedTab) return
                                setTab(key as string)
                                // bounce()
                                setShouldFilter(selectedTab.shouldFilter)
                            }}
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.key}
                                    title={
                                        <div className='flex items-center space-x-1'>
                                            <Icon className='size-4' icon={tab.icon} />
                                            <span>{tab.title}</span>
                                        </div>
                                    }
                                />
                            ))}
                        </Tabs>
                    </>
                )}
                <CommandInput
                    endContent={
                        <>
                            <Download />
                            {query ? (
                                <Button
                                    isIconOnly
                                    className='bg-default/20'
                                    radius='full'
                                    size='sm'
                                    startContent={<X size={18} />}
                                    variant='light'
                                    onPress={() => setQuery('')}
                                />
                            ) : (
                                children
                            )}
                        </>
                    }
                    placeholder={heading() || getSearchPlaceholder(user?.name)}
                    startContent={
                        <Button
                            isIconOnly
                            className={`${page ? 'bg-default/20' : 'data-[hover=true]:bg-transparent'}`}
                            radius='full'
                            size='sm'
                            startContent={page ? <ArrowLeft size={18} /> : <SearchIcon size={18} />}
                            variant={page ? 'flat' : 'light'}
                            onPress={() => {
                                if (page) {
                                    setPage(null)
                                    bounce()
                                }
                            }}
                        />
                    }
                    value={query}
                    onFocus={() => setOpen(true)}
                    onValueChange={(value) => setQuery(value)}
                />
            </Command>
        </AnimatedSearch>
    )
}
