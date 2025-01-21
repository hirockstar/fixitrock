'use client'
import { Tab, Tabs } from '@heroui/react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useHotkeys } from 'react-hotkeys-hook'
import { useEffect, useState } from 'react'

function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
    const [hasMounted, setHasMounted] = useState(false)

    useHotkeys('d', () => setTheme('dark'), [setTheme])
    useHotkeys('l', () => setTheme('light'), [setTheme])
    useHotkeys('s', () => setTheme('system'), [setTheme])

    useEffect(() => {
        setHasMounted(true)
    }, [])

    const tabs = [
        { theme: 'light', icon: <Sun size={14} /> },
        { theme: 'system', icon: <Monitor size={14} /> },
        { theme: 'dark', icon: <Moon size={14} /> },
    ]

    return (
        <Tabs
            aria-label='Theme Switcher'
            classNames={{
                base: 'rounded-full border',
                tabContent: 'group-data-[selected=true]:text-none text-black dark:text-white',
                tabList: 'gap-1 bg-background',
                tab: 'px-2',
                cursor: 'border-[0.5px] shadow-none group-data-[selected=true]:bg-default/20 dark:group-data-[selected=true]:bg-default/40',
            }}
            radius='full'
            selectedKey={hasMounted ? theme : undefined}
            defaultSelectedKey='light'
            size='sm'
            variant='light'
            onSelectionChange={(key) => setTheme(String(key))}
        >
            {tabs.map((item) => (
                <Tab key={item.theme} aria-label={item.theme} title={item.icon} />
            ))}
        </Tabs>
    )
}

export default ThemeSwitcher
