'use client'

import { Grid } from '®/components/drive/grid'
import { useDrive } from '®tanstack/query'

export default function Home() {
    const { data, isLoading, selectItem } = useDrive('')

    return (
        <div className='mx-auto w-full space-y-4 p-1 py-4 sm:p-4 2xl:px-[10%]'>
            <Grid data={data} isLoading={isLoading} onSelect={selectItem} />
        </div>
    )
}
