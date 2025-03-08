'use client'

import { Grid } from '®/components/drive/grid'

import { useDrive } from '®tanstack/query'

export default function Home() {
    const { data, isLoading, selectItem } = useDrive('')

    return (
        <div className='mx-auto mt-4 w-full max-w-7xl p-2'>
            <Grid data={data} isLoading={isLoading} onSelect={selectItem} />
        </div>
    )
}
