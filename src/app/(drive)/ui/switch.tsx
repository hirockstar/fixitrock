'use client'
import { Tab, Tabs } from '@heroui/react'

import useLayout from '®hooks/useLayout'
import { Grid, List } from '®ui/icons'

export function SwitchLayout() {
    const { layout, setLayout } = useLayout()

    const tabs = [
        { layout: 'Grid', icon: <Grid /> },
        { layout: 'List', icon: <List /> },
    ]

    return (
        <Tabs
            aria-label='Layout Switcher'
            className=''
            classNames={{
                base: 'rounded-md p-1',
                tabContent: '!group-data-[selected=true]:text-muted-foreground',
                tabList: 'gap-1 bg-background p-0',
                tab: 'px-1',
                cursor: 'shadow-none group-data-[selected=true]:rounded group-data-[selected=true]:bg-muted dark:group-data-[selected=true]:bg-muted',
            }}
            selectedKey={layout === 'Grid' ? 'Grid' : 'List'}
            size='sm'
            variant='light'
            onSelectionChange={() => {
                setLayout(layout === 'Grid' ? 'List' : 'Grid')
            }}
        >
            {tabs.map((item) => (
                <Tab key={item.layout} aria-label={item.layout} title={item.icon} />
            ))}
        </Tabs>
    )
}
