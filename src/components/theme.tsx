'use client'
import { Tab, Tabs } from '@heroui/react'
import { useTheme } from 'next-themes'
import { useHotkeys } from 'react-hotkeys-hook'
import { useEffect, useState } from 'react'

import { siteConfig } from '®config/site'

function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
    const [hasMounted, setHasMounted] = useState(false)

    useHotkeys('d', () => setTheme('dark'), [setTheme])
    useHotkeys('l', () => setTheme('light'), [setTheme])
    useHotkeys('s', () => setTheme('system'), [setTheme])

    useEffect(() => {
        setHasMounted(true)
    }, [])

    return (
        <Tabs
            aria-label='Theme Switcher'
            classNames={{
                base: 'rounded-full border',
                tabContent: 'group-data-[selected=true]:text-none text-black dark:text-white',
                tabList: 'bg-background gap-1',
                tab: 'px-2',
                cursor: 'group-data-[selected=true]:bg-default/20 dark:group-data-[selected=true]:bg-default/40 border-[0.5px] shadow-none',
            }}
            defaultSelectedKey='light'
            radius='full'
            selectedKey={hasMounted ? theme : undefined}
            size='sm'
            variant='light'
            onSelectionChange={(key) => setTheme(String(key))}
        >
            {siteConfig.themes.map((t) => (
                <Tab key={t.theme} aria-label={t.description} title={<t.icon size={14} />} />
            ))}
        </Tabs>
    )
}

export default ThemeSwitcher
