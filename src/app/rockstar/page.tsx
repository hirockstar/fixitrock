'use client'

import dynamic from 'next/dynamic'

import Profile from './ui/profile'
const Tabs = dynamic(() => import('./ui/tabs'), {
    ssr: false,
})

export default function Page() {
    return (
        <main>
            <Profile />
            <div className='mx-auto -mt-12 p-1 2xl:px-[10%]'>
                <Tabs />
            </div>
        </main>
    )
}
