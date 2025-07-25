import { Moon, SunIcon } from 'lucide-react'
import { BsUsbSymbol, BsApple } from 'react-icons/bs'
import { FaRupeeSign, FaUnlock } from 'react-icons/fa'
import { MdPhonelinkSetup } from 'react-icons/md'
import { RiComputerLine } from 'react-icons/ri'
import { TbApps, TbDeviceGamepad2 } from 'react-icons/tb'
import { SiGhostery } from 'react-icons/si'
import { GiAutoRepair } from 'react-icons/gi'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
    title: 'Fix iT Rock',
    tagline: 'My tagline',
    description:
        'We Provide Mobile Firmwares Drivers Flash Tool FRP Dump FIle EMMC ISP PinOut Samsung MDM File Windows Files.',
    domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://fixitrock.com',
    baseDirectory: 'Drive',
    directoryUrl: '/space',
    cacheControlHeader: 'max-age=0, s-maxage=60, stale-while-revalidate',
    suggestion: [
        {
            href: '/',
            title: 'Home',
            description: 'Go to the main page',
            icon: SiGhostery,
        },
        {
            href: '/space',
            title: 'Firmware',
            description: 'Find and download firmware files',
            icon: GiAutoRepair,
        },
        {
            href: '/space/apps',
            title: 'Apps',
            description: 'Download apps for Android, MacOS, Windows, and Linux',
            icon: TbApps,
        },
        {
            href: '/space/games',
            title: 'Games',
            description: 'Download games for Android, MacOS, Windows, and Linux',
            icon: TbDeviceGamepad2,
        },
        {
            href: '/frp',
            title: 'FRP Bypass',
            description: 'Get FRP Bypass files and tools for your device',
            icon: FaUnlock,
        },
        {
            href: '/space/drivers',
            title: 'USB Drivers',
            description: 'Download Android USB flashing drivers',
            icon: BsUsbSymbol,
        },
        {
            href: '/space/flash-tool',
            title: 'Flashing Tools',
            description: 'Tools for flashing mobile devices',
            icon: MdPhonelinkSetup,
        },
        {
            href: '/space/icloud',
            title: 'iCloud Bypass',
            description: 'Say goodbye to iCloud locks: Unlock now.',
            icon: BsApple,
        },
        {
            href: '/scpl',
            title: 'Spare Parts Price',
            description: 'Find genuine mobile parts service centers',
            icon: FaRupeeSign,
        },
    ],
    themes: [
        {
            title: 'Light',
            theme: 'light',
            description: 'Change Theme to Light',
            icon: SunIcon,
        },
        {
            title: 'System',
            theme: 'system',
            description: 'Change Theme to System',
            icon: RiComputerLine,
        },
        {
            title: 'Dark',
            theme: 'dark',
            description: 'Change Theme to Dark',
            icon: Moon,
        },
    ],
}
export type TabsConfig = typeof tabsConfig

export const tabsConfig = {
    user: [
        {
            title: 'home',
            href: '',
        },
    ],
    admin: [
        {
            title: 'quotes',
            href: '/quotes',
        },
    ],
}
export const META_THEME_COLORS = {
    light: '#ffffff',
    dark: '#00000',
}
