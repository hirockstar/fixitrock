'use client'
import { Tab, Tabs as UiTabs } from '@heroui/react'

import useTabs from '®hooks/useTabs'

import { Quotes } from './quotes'
import { Activity } from './activity'

export default function Tabs() {
    const { tab, setTab, hasMounted } = useTabs('activity')

    return (
        <UiTabs
            classNames={{
                base: 'sticky top-0 z-20 w-full border-b bg-background py-0.5',
            }}
            selectedKey={hasMounted ? tab : ''}
            variant='underlined'
            onSelectionChange={(key) => setTab(String(key))}
        >
            <Tab key='activity' title='Activity'>
                <Activity />
            </Tab>
            <Tab key='posts' title='Posts' />
            <Tab key='quotes' title='Quotes'>
                <Quotes />
            </Tab>
            <Tab key='photos' title='Photos' />
            <Tab key='videos' title='Videos' />
            <Tab key='about' title='About' />
        </UiTabs>
    )
}
