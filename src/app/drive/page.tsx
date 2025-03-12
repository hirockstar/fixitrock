'use client'

import { useDrive } from '®tanstack/query'

import { Grid } from './ui'

export default function Page() {
    const { data, isLoading, selectItem } = useDrive('')
    return <Grid data={data} isLoading={isLoading} onSelect={selectItem} />
}
