'use client'

import { Grid } from '®/components/drive/grid'
import { useDrive } from '®/hooks/useDrive'

export default function Home() {
    const { data, isLoading, onSelectItem } = useDrive([''])
    return (
        <div className='mx-auto mt-4 w-full max-w-7xl p-2'>
            <Grid data={data} isLoading={isLoading} onSelectItem={onSelectItem} />
        </div>
    )
}
