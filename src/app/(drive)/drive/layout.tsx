import { Metadata } from 'next'

import { siteConfig } from '®/config/site'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
export const metadata: Metadata = {
    title: {
        default: 'Drive',
        template: `%s - ${siteConfig.title}`,
    },
    description:
        'We Provide Mobile Firmwares Drivers Flash Tool FRP Dump FIle EMMC ISP PinOut Samsung MDM File Windows Files.',
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
        images: '/api/drive/og?slug=/',
    },
    category: 'technology',
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
}
