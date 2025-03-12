import { Metadata } from 'next'
import { Suspense } from 'react'

import { Card } from '../frp/card'

import { siteConfig } from '®config/site'
import { GridSkeleton } from '®ui/skeleton'
import { getData } from '®actions/supabase'

export default async function FRP() {
    const repair = await getData('repair')

    return (
        <div className='mx-auto mt-8 w-full max-w-7xl space-y-8 p-4'>
            <Suspense fallback={<GridSkeleton />}>
                <div className='space-y-4 text-center'>
                    <h1 className='text-3xl font-extrabold md:text-4xl lg:text-5xl'>
                        Find Genuine Mobile Parts & Service Centers
                    </h1>
                    <p className='text-base text-muted-foreground md:text-lg lg:text-xl'>
                        Explore the best repair options with authentic parts and trusted service
                        providers for leading mobile brands.
                    </p>
                </div>
                <div className='grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-2'>
                    {repair.map((r) => (
                        <Card key={r.id} c={r} />
                    ))}
                </div>
            </Suspense>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Mobile Repair Parts Service Centers',
    description:
        'Discover genuine repair parts and authorized service center locations for top mobile brands. Get the best prices for spare parts and repairs.',
    keywords:
        'mobile repair parts, authorized service centers, genuine mobile parts, smartphone repair, mobile brands service, phone parts pricing, Samsung repair parts, iPhone service center, mobile phone repair cost, mobile parts shop',
    authors: [
        {
            name: 'Rock Star',
            url: 'https://rockstar.bio',
        },
    ],
    publisher: 'Rock Star',
    openGraph: {
        title: 'Mobile Repair Parts  Service Centers',
        url: new URL(siteConfig.domain),
        type: 'website',
        images: `/repair.png`,
        siteName: siteConfig.title,
    },
}
