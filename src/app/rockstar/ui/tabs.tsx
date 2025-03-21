'use client'
import { Tab, Tabs as UiTabs } from '@heroui/react'

import { Quotes } from './quotes'
import { Activity } from './activity'

export default function Tabs() {
    return (
        <UiTabs
            classNames={{
                base: 'sticky top-0 z-20 w-full border-b bg-background py-0.5',
            }}
            variant='underlined'
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
