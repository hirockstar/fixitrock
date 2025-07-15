import { Suspense } from 'react'
import { Metadata } from 'next'

import { getData } from '®actions/supabase'
import { GridSkeleton } from '®ui/skeleton'
import { siteConfig } from '®config/site'
import { FRP as Types } from '®types/frp'

import FRPCard from './card'

export default function Page() {
    return (
        <main className='mx-auto w-full p-2 2xl:px-[2rem]'>
            <Suspense
                fallback={
                    <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 px-2'>
                        <GridSkeleton />
                    </div>
                }
            >
                <FRP />
            </Suspense>
        </main>
    )
}

async function FRP() {
    const data = await getData<Types>('frp')

    return <FRPCard data={data} />
}

export const metadata: Metadata = {
    title: 'FRP Bypass',
    description:
        'Unlock your device with FRP Bypass. Find the necessary tools and resources to bypass Google Factory Reset Protection (FRP).',
    keywords: [
        'FRP Bypass',
        'Factory Reset Protection',
        'bypass Google FRP',
        'unlock Android',
        'FRP unlock tools',
        'remove Google account lock',
        'Android FRP bypass',
        'FRP removal tools',
        'Samsung FRP bypass',
        'Google lock removal',
        'FRP bypass solutions',
        'FRP unlock guide',
        'Android bypass methods',
        'FRP reset tools',
        'bypass Google Factory Reset Protection',
    ],
    authors: [
        {
            name: 'Rock Star 💕',
            url: 'https://rockstar.bio',
        },
    ],
    publisher: 'Rock Star 💕',
    openGraph: {
        title: 'FRP Bypass',
        url: new URL(siteConfig.domain),
        type: 'website',
        images: `/space/og?slug=/FRP-Files`,
        siteName: siteConfig.title,
    },
}
