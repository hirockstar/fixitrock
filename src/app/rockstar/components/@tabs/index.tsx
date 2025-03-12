'use client'

import { Tab, Tabs as UiTabs } from '@heroui/react'
import { usePathname } from 'next/navigation'

import { tabsConfig } from '®config/site'

export default function Tabs() {
    const path = usePathname()

    return (
        <UiTabs
            classNames={{
                base: 'w-full border-b',
            }}
            variant='underlined'
        >
            {tabsConfig.user.map((t) => (
                <Tab
                    key={path}
                    href={`${path}${t.href}`}
                    title={t.title.replace(/^./, (c) => c.toUpperCase())}
                />
            ))}
        </UiTabs>
    )
}
