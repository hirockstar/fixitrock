import { Moon, SunIcon } from 'lucide-react'
import { BsApple, BsFillUnlockFill, BsUsbSymbol } from 'react-icons/bs'
import { MdPhonelinkSetup } from 'react-icons/md'
import { RiComputerLine } from 'react-icons/ri'
import { TbApps, TbDeviceGamepad2 } from 'react-icons/tb'

const iconClass = 'mx-auto size-5 text-muted-foreground'

export const suggestion = [
    {
        href: '/Apps',
        title: 'Apps',
        description: 'Download apps for Android, MacOS, Windows, and Linux',
        icon: <TbApps className={iconClass} />,
    },
    {
        href: '/Games',
        title: 'Games',
        description: 'Download games for Android, MacOS, Windows, and Linux',
        icon: <TbDeviceGamepad2 className={iconClass} />,
    },
    {
        href: '/frp',
        title: 'FRP Bypass Tools',
        description: 'Get FRP Bypass files and tools for your device',
        icon: <BsFillUnlockFill className={iconClass} />,
    },
    {
        href: '/Drivers',
        title: 'USB Drivers',
        description: 'Download Android USB flashing drivers',
        icon: <BsUsbSymbol className={iconClass} />,
    },
    {
        href: '/Flash-Tool',
        title: 'Flashing Tools',
        description: 'Tools for flashing mobile devices',
        icon: <MdPhonelinkSetup className={iconClass} />,
    },
    {
        href: '/iCloud',
        title: 'iCloud Bypass Solutions',
        description: 'Say goodbye to iCloud locks: Unlock now.',
        icon: <BsApple className={iconClass} />,
    },
    // {
    //     href: '/service-center-price-list',
    //     title: 'Parts Price List',
    //     description: 'View the price list for parts at our service center',
    //     icon: <FaRupeeSign className={iconClass} />,
    // },
    // {
    //     href: '/sponsor',
    //     title: 'Become a Sponsor',
    //     description: 'Show your support and sponsor us',
    //     icon: <SiGithubsponsors className={iconClass} />,
    // },
]

export const themes = [
    {
        title: 'Light',
        theme: 'light',
        description: 'Change Theme to Light',
        icon: <SunIcon className={iconClass} />,
    },
    {
        title: 'System',
        theme: 'system',
        description: 'Change Theme to System',
        icon: <RiComputerLine className={iconClass} />,
    },
    {
        title: 'Dark',
        theme: 'dark',
        description: 'Change Theme to Dark',
        icon: <Moon className={iconClass} />,
    },
]
