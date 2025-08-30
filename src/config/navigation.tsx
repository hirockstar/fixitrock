export type CommandType = {
    id: string
    title: string
    description?: string
    icon: string
    type?: 'section' | 'action' | 'file' | 'product'
    href?: string
    children?: CommandType[]
    searchHook?: (query: string) => { data: CommandType[]; isLoading: boolean }
    onSelect?: () => void
}

export const Navigations: Record<string, CommandType[]> = {
    // brands: [
    //     {
    //         id: 'brands',
    //         href: 'brands',
    //         icon: 'mdi:award',
    //         title: 'Browse Brands . . .',
    //         description: 'Explore your complete brand catalog with advanced filtering and search',
    //     },
    //     {
    //         id: 'create',
    //         href: 'brands/create',
    //         icon: 'material-symbols:add',
    //         title: 'Add New Brand',
    //         description: 'Create and add new brands to the catalog with detailed specifications',
    //     },
    // ],
    // products: [
    //     {
    //         id: 'products',
    //         href: 'products',
    //         icon: 'gridicons:product',
    //         title: 'Browse Products . . .',
    //         description: 'Explore your complete product catalog with advanced filtering and search',
    //     },
    //     {
    //         id: 'create',
    //         icon: 'material-symbols:add',
    //         title: 'Add New Product',
    //         description: 'Create and add new products to the catalog with detailed specifications',
    //     },
    // ],
    space: [
        {
            id: 'space',
            title: 'Search in Space . . .',
            description:
                'Space is a place where you can find all the tools you need to fix your device',
            icon: 'fluent:phone-link-setup-24-regular',
            type: 'section',
            children: [
                {
                    id: 'space-apps',
                    title: 'Apps',
                    description: 'Get the latest apps for Android, iOS, Windows, MacOS, and Linux',
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
                    description: 'Remove Factory Reset Protection and unlock your Android device',
                    icon: 'hugeicons:phone-lock',
                    href: '/frp',
                },
                {
                    id: 'space-icloud',
                    title: 'iCloud Bypass',
                    description: 'Unlock iCloud locked devices with our reliable bypass solutions',
                    icon: 'mdi:apple',
                    href: '/space/icloud',
                },
                {
                    id: 'space-drivers',
                    title: 'USB Drivers',
                    description: 'Download official USB drivers for Android flashing and rooting',
                    icon: 'hugeicons:usb-connected-01',
                    href: '/space/drivers',
                },
                {
                    id: 'space-flash-tool',
                    title: 'Flashing Tools',
                    description: 'Professional tools for flashing, rooting, and unlocking devices',
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
            description: 'Remove Factory Reset Protection and unlock your Android device',
            icon: 'hugeicons:phone-lock',
            href: '/frp',
        },
        {
            id: 'space-flash-tool',
            title: 'Flashing Tools',
            description: 'Professional tools for flashing, rooting, and unlocking devices',
            icon: 'hugeicons:phone-arrow-up',
            href: '/space/flash-tool',
        },
    ],
    general: [
        {
            id: 'home',
            title: 'Go back',
            description: 'Return to home page',
            icon: 'simple-icons:ghostery',
            href: '/',
        },
        {
            id: 'theme',
            title: 'Change Theme . . .',
            description: 'Choose your preferred theme',
            icon: 'fa7-solid:brush',
            type: 'section',
            children: [
                {
                    id: 'theme-light',
                    title: 'Light',
                    description: 'Change Theme to Light',
                    icon: 'line-md:moon-to-sunny-outline-loop-transition',
                    type: 'action',
                    onSelect: () => alert('Changing theme to light...'),
                },
                {
                    id: 'theme-system',
                    title: 'System',
                    description: 'Change Theme to System',
                    icon: 'line-md:computer',

                    type: 'action',
                    onSelect: () => alert('Changing theme to system...'),
                },
                {
                    id: 'theme-dark',
                    title: 'Dark',
                    description: 'Change Theme to Dark',
                    icon: 'line-md:sunny-outline-to-moon-alt-loop-transition',
                    type: 'action',
                    onSelect: () => alert('Changing theme to dark...'),
                },
            ],
        },
    ],
}
