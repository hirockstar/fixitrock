import { Metadata } from 'next'

import { siteConfig } from '@/config/site'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

export const metadata: Metadata = {
    title: {
        default: 'Rock Star 💕',
        template: `%s - Rock Star 💕`,
    },
    description: '',
    keywords: [],
    authors: [
        {
            name: 'Rock Star 💕',
            url: 'https://rockstar.bio',
        },
    ],
    publisher: 'Rock Star 💕',
    openGraph: {
        title: 'Rock Star 💕',
        url: new URL(siteConfig.domain),
        type: 'website',
        images: `/rockstar/og`,
        siteName: siteConfig.title,
    },
}
