export type CommandType = {
    id: string
    title: string
    description?: string
    shortCut?: string
    keywords?: string[]
    icon: string
    href?: string
    children?: CommandType[]
    searchHook?: (query: string) => { data: CommandType[]; isLoading: boolean }
    onSelect?: () => void
}

export type Actions = {
    setTheme?: (theme: string) => void
    setPages?: (pages: string) => void
}

export const Navigations = (actions: Actions): Record<string, CommandType[]> => {
    return {
        space: [
            {
                id: 'space',
                title: 'Search Firmwares . . .',
                icon: 'fluent:phone-link-setup-24-regular',
                onSelect: () => actions.setPages!('space'),
                children: [
                    {
                        id: 'space-firmwares',
                        title: 'Firmwares',
                        description:
                            'Download official firmware files for all mobile devices and brands',
                        icon: 'fluent:phone-link-setup-24-regular',
                        href: '/space',
                    },
                    {
                        id: 'space-apps',
                        title: 'Apps',
                        description:
                            'Get the latest apps for Android, iOS, Windows, MacOS, and Linux',
                        icon: 'ri:apps-2-ai-line',

                        href: '/space/apps',
                    },
                    {
                        id: 'space-games',
                        title: 'Games',
                        description: 'Download premium games for mobile, PC, and gaming consoles',
                        icon: 'ion:game-controller',
                        href: '/space/games',
                    },
                    {
                        id: 'space-frp',
                        title: 'FRP Bypass',
                        description:
                            'Remove Factory Reset Protection and unlock your Android device',
                        icon: 'hugeicons:phone-lock',
                        href: '/frp',
                    },
                    {
                        id: 'space-icloud',
                        title: 'iCloud Bypass',
                        description:
                            'Unlock iCloud locked devices with our reliable bypass solutions',
                        icon: 'mdi:apple',
                        href: '/space/icloud',
                    },
                    {
                        id: 'space-drivers',
                        title: 'USB Drivers',
                        description:
                            'Download official USB drivers for Android flashing and rooting',
                        icon: 'hugeicons:usb-connected-01',
                        href: '/space/drivers',
                    },
                    {
                        id: 'space-flash-tool',
                        title: 'Flashing Tools',
                        description:
                            'Professional tools for flashing, rooting, and unlocking devices',
                        icon: 'hugeicons:phone-arrow-up',
                        href: '/space/flash-tool',
                    },
                    {
                        id: 'space-spare-parts',
                        title: 'Spare Parts Price',
                        description:
                            'Find genuine mobile parts and authorized service centers near you',
                        icon: 'mynaui:rupee-waves',
                        href: '/scpl',
                    },
                ],
            },
            {
                id: 'space-frp',
                title: 'FRP Bypass',
                icon: 'hugeicons:phone-lock',
                href: '/frp',
            },
            {
                id: 'space-flash-tool',
                title: 'Flashing Tools',
                icon: 'hugeicons:phone-arrow-up',
                href: '/space/flash-tool',
            },
        ],
        general: [
            {
                id: 'home',
                title: 'Return to Home',
                icon: 'simple-icons:ghostery',
                href: '/',
            },
            {
                id: 'theme',
                title: 'Change Theme . . .',
                icon: 'fa7-solid:brush',
                onSelect: () => actions.setPages!('theme'),
                children: [
                    {
                        id: 'light',
                        title: 'Change Theme to Light',
                        icon: 'line-md:moon-to-sunny-outline-loop-transition',

                        onSelect: () => actions.setTheme!('light'),
                    },
                    {
                        id: 'system',
                        title: 'Change Theme to System',
                        icon: 'line-md:computer',

                        onSelect: () => actions.setTheme!('system'),
                    },
                    {
                        id: 'dark',
                        title: 'Change Theme to Dark',
                        icon: 'line-md:sunny-outline-to-moon-alt-loop-transition',
                        onSelect: () => actions.setTheme!('dark'),
                    },
                ],
            },
        ],
        help: [
            {
                id: 'support',
                title: 'Contact Support',
                icon: 'bx:support',
                href: 'https://wa.me/919927241144',
            },
        ],
    }
}

