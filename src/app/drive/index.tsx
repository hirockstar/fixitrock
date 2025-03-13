'use client'

import { useDrive } from '®tanstack/query'

import { Grid } from './ui'

export function Drive() {
    const { data, isLoading, selectItem } = useDrive('')

    return <Grid data={data} isLoading={isLoading} onSelect={selectItem} />
}
