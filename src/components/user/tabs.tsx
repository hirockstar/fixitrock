'use client'
import { Tab, Tabs as UiTabs } from '@heroui/react'

import useTabs from '®/hooks/useTabs'

import { Gallery } from './showcase/gallery'
import { Quotes } from './showcase/quotes'

export default function Tabs({ username }: { username: string }) {
    const { tab, setTab } = useTabs('home')

    return (
        <UiTabs
            classNames={{
                base: 'w-full border-b',
            }}
            selectedKey={tab}
            variant='underlined'
            onSelectionChange={(key) => setTab(String(key))}
        >
            <Tab key='home' title='Home'>
                <Gallery username={username} />
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
