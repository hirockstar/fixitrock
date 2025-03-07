'use client'
import { Tab, Tabs as UiTabs } from '@heroui/react'

import { Gallery } from './showcase/gallery'

export default function Tabs({ username }: { username: string }) {
    return (
        <UiTabs
            classNames={{
                base: 'w-full border-b',
            }}
            variant='underlined'
        >
            <Tab key='home' title='Home'>
                <Gallery username={username} />
            </Tab>
            <Tab key='posts' title='Posts' />
            <Tab key='quotes' title='Quotes' />
            <Tab key='photos' title='Photos' />
            <Tab key='videos' title='Videos' />
            <Tab key='about' title='About' />
        </UiTabs>
    )
}
