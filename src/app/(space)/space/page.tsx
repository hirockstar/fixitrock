import { Suspense } from 'react'
import { Metadata } from 'next'

import { GridSkeleton } from '®ui/skeleton'
import { siteConfig } from '®config/site'
import { getChildren } from '®actions/drive'

import { Grid } from '../ui'

export default function SpacePage() {
    return (
        <main className='mt-6'>
            <Suspense
                fallback={
                    <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 px-2'>
                        <GridSkeleton />
                    </div>
                }
            >
                <Space />
            </Suspense>
        </main>
    )
}

export const metadata: Metadata = {
    title: 'Space ~ Mobile Repair Resources',
    description:
        'Your digital space for mobile repair tools, firmware files, and guides. Everything you need in one place.',
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
        title: 'Space - Mobile Repair Resources',
        description:
            'Your digital space for mobile repair tools, firmware files, and guides. Everything you need in one place.',
        url: new URL(siteConfig.domain),
        siteName: siteConfig.title,
        type: 'website',
        images: '/Space/og',
    },
    category: 'technology',
}

async function Space() {
    const data = await getChildren('')

    return <Grid data={data} />
}
