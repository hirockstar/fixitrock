'use client'

import { Firmware, FRP, Quotes } from './_showcase'

export default function Page() {
    return (
        <main className='mx-auto space-y-10 p-1 py-4 pb-10 sm:p-4 2xl:px-[10%]'>
            <Firmware />
            <FRP />
            <Quotes />
        </main>
    )
}
