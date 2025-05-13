import Profile from '../ui/profile'
import Tabs from '../ui/tabs'
import { Suspense } from 'react'

export default function Page() {
    return (
        <main>
            <Profile />
            <div className='mx-auto -mt-12 p-1 2xl:px-[10%]'>
                <Suspense fallback={<div>Loading...</div>}>
                    <Tabs />
                </Suspense>
            </div>
        </main>
    )
}
