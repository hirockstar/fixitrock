import { Metadata } from 'next'

import { siteConfig } from '®config/site'

import { Drive } from '.'

export default function Page() {
    return (
        <main className='mx-auto mt-4 w-full p-1 md:px-4 2xl:px-[10%]'>
            <Drive />
        </main>
    )
}

export const metadata: Metadata = {
    title: 'Drive',
    description:
        'We Provide Mobile Firmwares Drivers Flash Tool FRP Dump FIle EMMC ISP PinOut Samsung MDM File Windows Files.',
    keywords: [
        'fixitrock',
        'flash tool',
        'FRP bypass files',
        'EMMC ISP pinout',
        'Samsung MDM file',
        'Windows drivers',
        'FRP dump file',
        'firmware files',
        'Android tools',
        'Drive Fix iT Rock',
    ],

    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: `Drive`,
        startupImage: ['/icons/fixitrock.png'],
    },
    icons: {
        icon: '/favicon.ico',
    },
    metadataBase: new URL(siteConfig.domain),
    openGraph: {
        title: 'Drive',
        description:
            'We Provide Mobile Firmwares Drivers Flash Tool FRP Dump FIle EMMC ISP PinOut Samsung MDM File Windows Files.',
        url: new URL(siteConfig.domain),
        siteName: siteConfig.title,
        type: 'website',
        images: '/drive/og',
    },
    category: 'technology',
}
