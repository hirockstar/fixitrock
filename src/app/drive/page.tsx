'use client'

import { Grid } from './@ui'

import { useDrive } from '®tanstack/query'

export default function Drive() {
    const { data, isLoading, selectItem } = useDrive('')

    return (
        <div className='mx-auto w-full space-y-4 p-1 py-4 sm:p-4 2xl:px-[10%]'>
            <Grid data={data} isLoading={isLoading} onSelect={selectItem} />
        </div>
    )
}
