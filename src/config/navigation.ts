export const Navigations = {
    brands: [
        {
            id: 'brands',
            href: 'brands',
            icon: 'mdi:award',
            title: 'Browse Brands . . .',
            priority: 1,
            description: 'Explore your complete brand catalog with advanced filtering and search',
        },
        {
            id: 'create',
            href: 'brands/create',
            icon: 'material-symbols:add',
            title: 'Add New Brand',
            priority: 2,
            description: 'Create and add new brands to the catalog with detailed specifications',
        },
    ],
    products: [
        {
            id: 'products',
            href: 'products',
            icon: 'gridicons:product',
            title: 'Browse Products . . .',
            priority: 1,
            description: 'Explore your complete product catalog with advanced filtering and search',
        },
        {
            id: 'create',
            icon: 'material-symbols:add',
            title: 'Add New Product',
            action: 'navigate' as const,
            priority: 2,
            description: 'Create and add new products to the catalog with detailed specifications',
        },
    ],
    space: [
        {
            id: 'space',
            title: 'Search in Space . . .',
            description:
                'Space is a place where you can find all the tools you need to fix your device',
            icon: 'fluent:phone-link-setup-24-regular',
            action: 'navigate' as const,
            priority: 1,
            search: true,
            children: [
                {
                    id: 'space-apps',
                    title: 'Apps',
                    description: 'Get the latest apps for Android, iOS, Windows, MacOS, and Linux',
                    icon: 'ri:apps-2-ai-line',
                    href: '/space/apps',
                    priority: 2,
                },
                {
                    id: 'space-games',
                    title: 'Games',
                    description: 'Download premium games for mobile, PC, and gaming consoles',
                    icon: 'ion:game-controller',
                    href: '/space/games',

                    priority: 3,
                },
                {
                    id: 'space-frp',
                    title: 'FRP Bypass',
                    description: 'Remove Factory Reset Protection and unlock your Android device',
                    icon: 'hugeicons:phone-lock',
                    href: '/frp',

                    priority: 4,
                },
                {
                    id: 'space-icloud',
                    title: 'iCloud Bypass',
                    description: 'Unlock iCloud locked devices with our reliable bypass solutions',
                    icon: 'mdi:apple',
                    href: '/space/icloud',

                    priority: 5,
                },
                {
                    id: 'space-drivers',
                    title: 'USB Drivers',
                    description: 'Download official USB drivers for Android flashing and rooting',
                    icon: 'hugeicons:usb-connected-01',
                    href: '/space/drivers',

                    priority: 6,
                },
                {
                    id: 'space-flash-tool',
                    title: 'Flashing Tools',
                    description: 'Professional tools for flashing, rooting, and unlocking devices',
                    icon: 'hugeicons:phone-arrow-up',
                    href: '/space/flash-tool',

                    priority: 7,
                },
                {
                    id: 'space-spare-parts',
                    title: 'Spare Parts Price',
                    description:
                        'Find genuine mobile parts and authorized service centers near you',
                    icon: 'mynaui:rupee-waves',
                    href: '/scpl',

                    priority: 8,
                },
            ],
        },
        {
            id: 'space-frp',
            title: 'FRP Bypass',
            description: 'Remove Factory Reset Protection and unlock your Android device',
            icon: 'hugeicons:phone-lock',
            href: '/frp',

            priority: 2,
        },
        {
            id: 'space-flash-tool',
            title: 'Flashing Tools',
            description: 'Professional tools for flashing, rooting, and unlocking devices',
            icon: 'hugeicons:phone-arrow-up',
            href: '/space/flash-tool',

            priority: 3,
        },
    ],
    general: [
        {
            id: 'home',
            title: 'Go back',
            description: 'Return to home page',
            icon: 'simple-icons:ghostery',
            href: '/',
            priority: 1,
        },
        {
            id: 'theme',
            title: 'Change Theme . . .',
            description: 'Choose your preferred theme',
            icon: 'fa7-solid:brush',
            action: 'navigate' as const,
            priority: 2,
            children: [
                {
                    id: 'theme-light',
                    title: 'Light',
                    description: 'Change Theme to Light',
                    icon: 'line-md:moon-to-sunny-outline-loop-transition',
                    props: { theme: 'light' },
                    action: 'theme' as const,
                    priority: 1,
                },
                {
                    id: 'theme-system',
                    title: 'System',
                    description: 'Change Theme to System',
                    icon: 'line-md:computer',
                    props: { theme: 'system' },
                    action: 'theme' as const,
                    priority: 2,
                },
                {
                    id: 'theme-dark',
                    title: 'Dark',
                    description: 'Change Theme to Dark',
                    icon: 'line-md:sunny-outline-to-moon-alt-loop-transition',
                    props: { theme: 'dark' },
                    action: 'theme' as const,
                    priority: 3,
                },
            ],
        },
    ],
}
