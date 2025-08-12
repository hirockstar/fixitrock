'use client'

import { Tab, Tabs } from '@heroui/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Grid, List } from '@/ui/icons'
import useLayout, { type Layout } from '@/hooks/useLayout'

export function SwitchLayout() {
    const { layout, setLayout } = useLayout()
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleChange = (nextLayout: Layout) => {
        setLayout(nextLayout)
        const urlLayout = searchParams.get('layout')

        // Only update the URL if the layout is different from the current param
        if (urlLayout !== nextLayout) {
            const params = new URLSearchParams(searchParams.toString())

            params.set('layout', nextLayout)
            router.replace(`?${params.toString()}`)
        }
    }

    const tabs = [
        { layout: 'grid', icon: <Grid /> },
        { layout: 'list', icon: <List /> },
    ]

    return (
        <Tabs
            aria-label='Layout Switcher'
            classNames={{
                base: 'rounded-md p-1',
                tabContent: '!group-data-[selected=true]:text-muted-foreground',
                tabList: 'bg-background gap-1 p-0',
                tab: 'px-1',
                cursor: 'group-data-[selected=true]:bg-muted dark:group-data-[selected=true]:bg-muted shadow-none group-data-[selected=true]:rounded',
            }}
            selectedKey={layout}
            size='sm'
            variant='light'
            onSelectionChange={(key) => {
                handleChange(key as Layout)
            }}
        >
            {tabs.map((item) => (
                <Tab key={item.layout} aria-label={item.layout} title={item.icon} />
            ))}
        </Tabs>
    )
}
