import { Metadata } from 'next'

import { siteConfig } from '®config/site'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <main className='mx-auto mb-10 space-y-10 p-1 py-4 sm:p-4 2xl:px-[10%]'>{children}</main>
}

export const metadata: Metadata = {
    title: 'FRP Bypass',
    description:
        'Unlock your device with FRP Bypass. Find the necessary tools and resources to bypass Google Factory Reset Protection (FRP).',
    keywords:
        'FRP Bypass, Factory Reset Protection, bypass Google FRP, unlock Android device, FRP unlock tools, remove Google account lock, bypass FRP Android, FRP tools download, Samsung FRP bypass, Google lock removal, FRP unlock resources, Android bypass guide, FRP removal tips, bypass Google Factory Reset Protection, FRP bypass solutions',
    authors: [
        {
            name: 'Rock Star',
            url: 'https://rockstar.bio',
        },
    ],
    publisher: 'Rock Star',
    openGraph: {
        title: 'FRP Bypass',
        url: new URL(siteConfig.domain),
        type: 'website',
        images: `/api/drive/og?slug=/FRP-Files`,
        siteName: siteConfig.title,
    },
}
