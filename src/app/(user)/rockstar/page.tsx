import { Suspense } from 'react'
import Profile from '../ui/profile'
import Tabs from '../ui/tabs'

export default function Page() {
    return (
        <main>
            <Profile />
            <div className='mx-auto -mt-12 p-1 2xl:px-[10%]'>
                <Suspense fallback={<div className='bg-muted/50 h-10 w-full animate-pulse' />}>
                    <Tabs />
                </Suspense>
            </div>
        </main>
    )
}
