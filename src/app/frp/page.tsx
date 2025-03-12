import { Metadata } from 'next'
import { Suspense } from 'react'

import { Card } from './card'

import { siteConfig } from '®config/site'
import { GridSkeleton } from '®ui/skeleton'
import { getData } from '®actions/supabase'

export default async function FRP() {
    const frp = await getData('frp')

    return (
        <div className='mx-auto mt-4 w-full max-w-7xl p-2'>
            <Suspense fallback={<GridSkeleton />}>
                <div className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-2'>
                    {frp.map((f) => (
                        <Card key={f.id} c={f} />
                    ))}
                </div>
            </Suspense>
        </div>
    )
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
