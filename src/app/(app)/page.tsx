'use client'

import { Firmware, FRP, Quotes } from './showcase'

export default function Page() {
    return (
        <main className='mx-auto mb-10 space-y-10 p-2 2xl:p-[2rem]'>
            <Firmware />
            <FRP />
            <Quotes />
        </main>
    )
}
