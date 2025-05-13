'use client'

import { Firmware, FRP, Quotes } from './(app)/showcase'

export default function Page() {
    return (
        <main className='mx-auto mb-10 space-y-10 p-1 py-4 sm:p-4 2xl:px-[10%]'>
            <Firmware />
            <FRP />
            <Quotes />
        </main>
    )
}
